import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ChevronDown, History, Package, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { productStockQueries, useDeleteStock, useUpsertStock } from '../../../lib/queries/stock'

import './inventaire.css'

type Tab = 'stock' | 'history'

const formatPrice = (cents: number | null | undefined): string => {
  if (cents == null) return '-'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

// Helper pour formater les dates
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const InventairePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('stock')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const {
    data: stocks,
    isLoading: isLoadingStock,
    error: stockError,
  } = useQuery(productStockQueries.list())
  const {
    data: entries,
    isLoading: isLoadingEntries,
    error: entriesError,
  } = useQuery({
    ...productStockQueries.entries(),
    enabled: activeTab === 'history', // Ne charge l'historique que si l'onglet est actif
  })

  // Mutations
  const upsertMutation = useUpsertStock()
  const deleteMutation = useDeleteStock()

  const handleEditOpen = (productId: string, currentQty: number) => {
    setEditingId(productId)
    setEditValue(String(currentQty))
  }

  const handleSave = async (productId: string) => {
    const qty = parseInt(editValue, 10)
    if (isNaN(qty) || qty < 0) return
    await upsertMutation.mutateAsync({ productId, quantity: qty })
    setEditingId(null)
  }

  const handleDelete = async (productId: string) => {
    await deleteMutation.mutateAsync(productId)
  }

  const isLoading = activeTab === 'stock' ? isLoadingStock : isLoadingEntries
  const error = activeTab === 'stock' ? stockError : entriesError

  if (isLoading) {
    return (
      <div className="inv-page-container inv-loading">
        <div className="inv-loading-content">
          <div className="inv-spinner"></div>
          <p className="inv-loading-text">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="inv-page-container">
      <div className="inv-header">
        <div className="inv-header-inner">
          <h1 className="inv-title">INVENTAIRE</h1>

          <div className="inv-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              className={`inv-tab ${activeTab === 'stock' ? 'inv-tab-active' : ''}`}
            >
              <Package className="inv-tab-icon" />
              <span>Stock Actuel</span>
              {stocks && <span className="inv-tab-badge">{stocks.length}</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`inv-tab ${activeTab === 'history' ? 'inv-tab-active' : ''}`}
            >
              <History className="inv-tab-icon" />
              <span>Historique</span>
              {entries && <span className="inv-tab-badge">{entries.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="inv-content">
        {error && (
          <div className="inv-error-banner">
            <AlertCircle className="inv-error-icon" />
            <div>
              <h3 className="inv-error-title">Erreur de chargement</h3>
              <p className="inv-error-text">Impossible de récupérer les données.</p>
            </div>
          </div>
        )}

        {activeTab === 'stock' &&
          (!stocks || stocks.length === 0 ? (
            <div className="inv-empty-state">
              <div className="inv-empty-icon">
                <Plus className="inv-empty-icon-inner" />
              </div>
              <h2 className="inv-empty-title">Aucun produit en stock</h2>
              <p className="inv-empty-text">
                Commencez par ajouter des produits à votre inventaire
              </p>
            </div>
          ) : (
            <div className="inv-stock-list">
              {stocks.map((stock) => (
                <div key={stock.id} className="inv-stock-card">
                  {/* Row Principal */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === stock.id ? null : stock.id)}
                    className="inv-stock-header"
                  >
                    <div className="inv-stock-info">
                      <h3 className="inv-stock-name">{stock.product.name}</h3>
                      <p className="inv-stock-category">{stock.product.kind}</p>
                    </div>

                    <div className="inv-stock-actions">
                      {editingId === stock.id ? (
                        <div className="inv-edit-group">
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="inv-edit-input"
                            // biome-ignore lint: autofocus ok
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSave(stock.id)
                            }}
                            disabled={upsertMutation.isPending}
                            className="inv-btn-confirm"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingId(null)
                            }}
                            className="inv-btn-cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="inv-quantity-display">
                            <p className="inv-quantity-value">{stock.qty}</p>
                            <p className="inv-quantity-status">
                              {stock.qty <= 2 ? '⚠️ Faible' : 'En stock'}
                            </p>
                          </div>
                          <ChevronDown
                            className={`inv-chevron ${expandedId === stock.id ? 'inv-chevron-open' : ''}`}
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {expandedId === stock.id && (
                    <div className="inv-stock-details">
                      <div className="inv-details-grid">
                        <div className="inv-detail-item">
                          <p className="inv-detail-label">SKU</p>
                          <p className="inv-detail-value inv-detail-mono">{stock.product.id}</p>
                        </div>
                        <div className="inv-detail-item">
                          <p className="inv-detail-label">Marque</p>
                          <p className="inv-detail-value">{stock.product.brand}</p>
                        </div>
                      </div>

                      {stock.product.description && (
                        <div className="inv-detail-description">
                          <p className="inv-detail-label">Description</p>
                          <p className="inv-detail-value">{stock.product.description}</p>
                        </div>
                      )}

                      <div className="inv-detail-actions">
                        <button
                          type="button"
                          onClick={() => handleEditOpen(stock.id, stock.qty)}
                          className="inv-btn inv-btn-primary"
                        >
                          Modifier quantité
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(stock.id)}
                          disabled={deleteMutation.isPending}
                          className="inv-btn inv-btn-danger"
                        >
                          <Trash2 className="inv-btn-icon" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

        {activeTab === 'history' &&
          (!entries || entries.length === 0 ? (
            <div className="inv-empty-state">
              <div className="inv-empty-icon">
                <History className="inv-empty-icon-inner" />
              </div>
              <h2 className="inv-empty-title">Aucun historique</h2>
              <p className="inv-empty-text">Les entrées d'achat apparaîtront ici</p>
            </div>
          ) : (
            <div className="inv-history-list">
              <div className="inv-history-header">
                <span>Date</span>
                <span>Produit</span>
                <span>Qté</span>
                <span>Prix</span>
              </div>
              {entries.map((entry) => (
                <div key={entry.id} className="inv-history-row">
                  <div className="inv-history-date">
                    <span className="inv-history-day">{formatDate(entry.purchasedAt)}</span>
                  </div>
                  <div className="inv-history-product">
                    <span className="inv-history-name">{entry.product.name}</span>
                    <span className="inv-history-brand">{entry.product.brand}</span>
                  </div>
                  <div className="inv-history-qty">
                    <span className="inv-history-qty-value">+{entry.qty}</span>
                  </div>
                  <div className="inv-history-price">
                    <span className="inv-history-price-value">
                      {formatPrice(entry.pricePaidCents)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}
