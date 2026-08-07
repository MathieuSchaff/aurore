import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpdateProfile } from '@/lib/queries/profile'
import { ProfileDashboard } from '../ProfileDashboard'

vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQuery: vi.fn(),
  useSuspenseQuery: vi.fn(),
}))

const { mockUseSearch, mockNavigate, LinkMock } = vi.hoisted(() => ({
  mockUseSearch: vi.fn(() => ({ tab: 'profile' })),
  mockNavigate: vi.fn(),
  // Hoisted with the rest: the router mock factory runs while the dashboard's
  // import graph resolves, before module-level consts initialize.
  LinkMock: ({ children, to }: { children?: unknown; to: string }) => (
    <a href={to}>{children as React.ReactNode}</a>
  ),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: LinkMock,
  createLink: () => LinkMock,
  getRouteApi: () => ({ useSearch: mockUseSearch, useNavigate: () => mockNavigate }),
}))

// Composition leaf like the stubs below; its composer pulls real
// useInfiniteQuery + a QueryClient this harness deliberately has none of.
vi.mock('../../../components/PreferenceMarks/PreferenceMarks', () => ({
  PreferenceMarks: () => <div data-testid="preference-marks" />,
}))

vi.mock('@/lib/queries/profile', () => ({
  profileQueries: {
    me: vi.fn(() => ({ queryKey: ['profile', 'me'] })),
    dermo: vi.fn(() => ({ queryKey: ['profile', 'dermo'] })),
  },
  preferenceTargetQueries: {
    list: vi.fn(() => ({
      queryKey: ['profile', 'preference-targets'],
      queryFn: () => ({ ingredients: [], tags: [] }),
    })),
  },
  useUpdateProfile: vi.fn(),
  useDeleteIngredientPreference: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteTagPreference: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

// Sub-components are composition leaves; stub them so the dashboard's own
// wiring (hero, tabs, edit state, scroll-to-section) is what's under test.
vi.mock('../../../components/ProfileAvatar/ProfileAvatar', () => ({
  ProfileAvatar: ({ username }: { username?: string }) => (
    <div data-testid="profile-avatar">{username}</div>
  ),
}))
vi.mock('../../../../social/components/SimilarPeople/SimilarPeople', () => ({
  SimilarPeople: () => <div data-testid="similar-people" />,
}))
vi.mock('../../../components/ProfileForm/ProfileForm', () => ({
  ProfileForm: ({ onSubmit }: { onSubmit: (data: { bio: string }) => void }) => (
    <button type="button" onClick={() => onSubmit({ bio: 'new bio' })}>
      submit-identity
    </button>
  ),
}))
vi.mock('../../../components/SkinPortraitCard/SkinPortraitCard', () => ({
  SkinPortraitCard: ({ isEditing, onEdit }: { isEditing: boolean; onEdit: () => void }) => (
    <div data-testid="skin-portrait-card">
      {isEditing ? null : (
        <button type="button" onClick={onEdit}>
          Modifier le portrait de peau
        </button>
      )}
    </div>
  ),
}))
vi.mock('../../../components/ShelfPulse/ShelfPulse', () => ({
  ShelfPulse: () => <div data-testid="shelf-pulse" />,
}))
vi.mock('../../../components/CompletionStrip/CompletionStrip', () => ({
  CompletionStrip: () => <div data-testid="completion-strip" />,
}))
vi.mock('../../../tabs/AccountTab/AccountSettings', () => ({
  AccountSettings: () => <div data-testid="account-settings" />,
}))
vi.mock('../../../tabs/PreferencesTab/PreferenceSettings', () => ({
  PreferenceSettings: () => <div data-testid="preference-settings" />,
}))

function setProfile(profile: {
  username?: string
  bio?: string | null
  avatarUrl?: string | null
  createdAt?: string
  links?: Array<{ url: string; label: string }>
}) {
  vi.mocked(useSuspenseQuery).mockReturnValue({
    data: {
      username: profile.username ?? 'mathieu',
      bio: profile.bio ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      createdAt: profile.createdAt ?? null,
      links: profile.links ?? [],
    },
  } as unknown as ReturnType<typeof useSuspenseQuery>)
}

function setDermo(dermo: unknown) {
  vi.mocked(useQuery).mockReturnValue({
    data: dermo,
    isLoading: false,
  } as unknown as ReturnType<typeof useQuery>)
}

function setUpdateProfile(overrides: Partial<ReturnType<typeof useUpdateProfile>> = {}) {
  const mutate = vi.fn()
  const reset = vi.fn()
  vi.mocked(useUpdateProfile).mockReturnValue({
    mutate,
    reset,
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useUpdateProfile>)
  return { mutate, reset }
}

describe('ProfileDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSearch.mockReturnValue({ tab: 'profile' })
    setProfile({ bio: 'Hello world' })
    setDermo(null)
    setUpdateProfile()
  })

  // One identity object, so the bio lives in the hero and nowhere else.
  it('renders the bio once, inside the profile hero', () => {
    setProfile({ username: 'mathieu', bio: 'Skincare nerd' })
    render(<ProfileDashboard />)

    expect(screen.getByRole('heading', { name: 'mathieu' })).toBeInTheDocument()
    expect(screen.getAllByText('Skincare nerd')).toHaveLength(1)
  })

  it('shows the panel for the tab selected in the URL', () => {
    mockUseSearch.mockReturnValue({ tab: 'account' })
    render(<ProfileDashboard />)

    expect(screen.getByTestId('account-settings').closest('[role="tabpanel"]')).not.toHaveAttribute(
      'hidden'
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Compte' })).toHaveClass('sr-only')
  })

  it('navigates to the clicked tab instead of holding it in local state', () => {
    render(<ProfileDashboard />)

    expect(screen.getByTestId('account-settings').closest('[role="tabpanel"]')).toHaveAttribute(
      'hidden'
    )

    fireEvent.click(screen.getByRole('tab', { name: /Compte/ }))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    const arg = mockNavigate.mock.calls[0][0] as { search: (prev: object) => object }
    expect(arg.search({ tab: 'profile' })).toEqual({ tab: 'account' })
  })

  it('fires updateProfile.mutate when the identity form submits', () => {
    const { mutate } = setUpdateProfile()
    render(<ProfileDashboard />)

    fireEvent.click(screen.getByRole('button', { name: 'Modifier mes informations' }))
    fireEvent.click(screen.getByRole('button', { name: 'submit-identity' }))

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate.mock.calls[0][0]).toEqual({ bio: 'new bio' })
  })
})
