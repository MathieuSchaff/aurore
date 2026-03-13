import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { productStockQueries, useDeleteStock, useUpsertStock } from '../../../lib/queries/stock'
import './inventaire.css'

// import type { Product } from '@habit-tracker/shared'

export const InventairePage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // Récupère la liste des stocks
  const { data: stocks, isLoading, error } = useQuery(productStockQueries.list())
  if (stocks && stocks.length > 0) {
    // console.log(stocks[0].length)
  }
  // const first = stocks[0].
  // Mutations
  // const stockId = stocks[0]
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

  if (isLoading) {
    return (
      <div className="inv-page-container inv-loading">
        <div className="inv-loading-content">
          <div className="inv-spinner"></div>
          <p className="inv-loading-text">Chargement de l'inventaire...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="inv-page-container">
      {/* Header */}
      <div className="inv-header">
        <div className="inv-header-inner">
          <h1 className="inv-title">INVENTAIRE</h1>
          <p className="inv-subtitle">
            {stocks?.length || 0} produit{stocks?.length !== 1 ? 's' : ''} en stock
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="inv-content">
        {error && (
          <div className="inv-error-banner">
            <AlertCircle className="inv-error-icon" />
            <div>
              <h3 className="inv-error-title">Erreur de chargement</h3>
              <p className="inv-error-text">Impossible de récupérer l'inventaire.</p>
            </div>
          </div>
        )}

        {!stocks || stocks.length === 0 ? (
          <div className="inv-empty-state">
            <div className="inv-empty-icon">
              <Plus className="inv-empty-icon-inner" />
            </div>
            <h2 className="inv-empty-title">Aucun produit en stock</h2>
            <p className="inv-empty-text">Commencez par ajouter des produits à votre inventaire</p>
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

                  {/* Quantité Affichage / Édition */}
                  <div className="inv-stock-actions">
                    {editingId === stock.id ? (
                      <div className="inv-edit-group">
                        <input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="inv-edit-input"
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

                {/* Détails Expandus */}
                {expandedId === stock.id && (
                  <div className="inv-stock-details">
                    <div className="inv-details-grid">
                      <div className="inv-detail-item">
                        <p className="inv-detail-label">SKU</p>
                        <p className="inv-detail-value inv-detail-mono">{stock.product.id}</p>
                      </div>
                      <div className="inv-detail-item">
                        <p className="inv-detail-label">Ajouter le</p>
                        <p className="inv-detail-value">
                          {/*{new Date(stock.createdAt).toLocaleDateString('fr-FR')}*/}
                        </p>
                      </div>
                    </div>

                    {stock.product.description && (
                      <div className="inv-detail-description">
                        <p className="inv-detail-label">Description</p>
                        <p className="inv-detail-value">{stock.product.description}</p>
                      </div>
                    )}

                    {/* Actions */}
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
        )}
      </div>
    </div>
  )
}
