import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeightPreferences } from '../review/WeightPreferences'
import { DEFAULT_WEIGHTS } from '../../../lib/helpers/reviews'

const defaultProps = {
  weights: { ...DEFAULT_WEIGHTS },
  displayScale: 'out_of_20' as const,
  onWeightsChange: vi.fn(),
  onScaleChange: vi.fn(),
}

describe('WeightPreferences', () => {
  it('affiche les 6 critères avec leur contrôle de poids', () => {
    render(<WeightPreferences {...defaultProps} />)
    expect(screen.getByLabelText('Poids de Tolérance')).toBeInTheDocument()
    expect(screen.getByLabelText('Poids de Efficacité')).toBeInTheDocument()
    expect(screen.getByLabelText('Poids de Sensorialité')).toBeInTheDocument()
    expect(screen.getByLabelText('Poids de Stabilité')).toBeInTheDocument()
    expect(screen.getByLabelText('Poids de Mixabilité')).toBeInTheDocument()
    expect(screen.getByLabelText('Poids de Rapport Q/P')).toBeInTheDocument()
  })

  it("affiche les 4 options d'échelle", () => {
    render(<WeightPreferences {...defaultProps} />)
    expect(screen.getByText('/5')).toBeInTheDocument()
    expect(screen.getByText('/10')).toBeInTheDocument()
    expect(screen.getByText('/20')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it("l'échelle active a aria-pressed=true", () => {
    render(<WeightPreferences {...defaultProps} displayScale="out_of_20" />)
    const btn = screen.getByText('/20')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('clic sur une échelle appelle onScaleChange', async () => {
    const onScaleChange = vi.fn()
    render(<WeightPreferences {...defaultProps} onScaleChange={onScaleChange} />)
    await userEvent.click(screen.getByText('%'))
    expect(onScaleChange).toHaveBeenCalledWith('percentage')
  })

  it('reset appelle onWeightsChange avec les poids par défaut', async () => {
    const onWeightsChange = vi.fn()
    render(<WeightPreferences {...defaultProps} onWeightsChange={onWeightsChange} />)
    await userEvent.click(screen.getByLabelText('Réinitialiser les poids'))
    expect(onWeightsChange).toHaveBeenCalledWith(DEFAULT_WEIGHTS)
  })
})
