import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { Leaf, MessageSquare, Pencil } from 'lucide-react'

import { BackButton } from '@/component/Button/BackButton'
import { Button } from '@/component/Button/Button'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions, PageTopActionsRight } from '@/component/Layout/PageLayout/PageTopActions'
import { type TabOption, Tabs } from '@/component/Tabs/Tabs'
import { ingredientQueries } from '@/lib/queries/ingredients'
import '@/features/ingredients/components/IngredientPage.css'

const route = getRouteApi('/ingredients/$slug')

type IngredientTab = 'infos' | 'discussions'

export function IngredientLayout() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const navigate = useNavigate()
  const location = useRouterState({ select: (s) => s.location })

  const isDiscussions = location.pathname.includes('/discussions')
  const activeTab: IngredientTab = isDiscussions ? 'discussions' : 'infos'

  const tabOptions: TabOption<IngredientTab>[] = [
    { id: 'infos', label: 'Infos' },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare size={14} /> },
  ]

  function handleTabChange(id: IngredientTab) {
    if (id === 'infos') {
      navigate({ to: '/ingredients/$slug', params: { slug } })
    } else {
      navigate({ to: '/ingredients/$slug/discussions', params: { slug } })
    }
  }

  return (
    <DetailPageLayout banner>
      <PageTopActions>
        <BackButton to="/ingredients">Ingredients</BackButton>
        <PageTopActionsRight>
          <Button to="/ingredients/$slug/edit" params={{ slug }} variant="primary">
            <Pencil size={14} />
            Modifier
          </Button>
        </PageTopActionsRight>
      </PageTopActions>

      <div className="ingredient-hero">
        <IconBox className="ingredient-hero__icon">
          <Leaf size={28} />
        </IconBox>
        <div className="ingredient-hero__info">
          <h1
            className="ingredient-hero__name"
            style={{ viewTransitionName: `ingredient-name-${slug}` }}
          >
            {ingredient.name}
          </h1>
          <div className="ingredient-hero__tags">
            {ingredient.category && <Badge variant="default">{ingredient.category}</Badge>}
          </div>
        </div>
      </div>

      <Tabs options={tabOptions} activeTab={activeTab} onTabChange={handleTabChange} />

      <div style={{ viewTransitionName: 'tab-content' }}>
        <Outlet />
      </div>
    </DetailPageLayout>
  )
}
