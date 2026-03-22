import type { UserProductStatus } from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Archive, Ban, Eye, Heart, Package, ShoppingBag, X, type LucideIcon } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { SearchCombobox } from '@/component/search/SearchCombobox'
import { BrandCombobox } from '@/features/products/components/BrandCombobox/BrandCombobox'
import { useScrollLock } from '../../../../hooks/useScrollLock'
import { productQueries, useCreateProduct } from '../../../../lib/queries/products'
import { useAddPurchase } from '../../../../lib/queries/purchases'
import { useCreateUserProduct } from '../../../../lib/queries/user-products'

import './QuickAddModal.css'

interface QuickAddModalProps {
  onClose: () => void
}

const statusLabels: Record<UserProductStatus, { label: string; icon: LucideIcon; color: string }> = {
  in_stock: { label: 'En stock', icon: Package, color: '#10b981' },
  wishlist: { label: 'Wishlist', icon: ShoppingBag, color: '#3b82f6' },
  watched: { label: 'Surveille', icon: Eye, color: '#f59e0b' },
  holy_grail: { label: 'Saint Graal', icon: Heart, color: '#ef4444' },
  archived: { label: 'Archivé', icon: Archive, color: '#6b7280' },
  avoided: { label: 'À éviter', icon: Ban, color: '#000000' },
}

export function QuickAddModal({ onClose }: QuickAddModalProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing')
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
    brand: string
    slug: string
  } | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<UserProductStatus>('in_stock')
  const [purchasedAt, setPurchasedAt] = useState(() => new Date().toISOString().split('T')[0])
  const [purchasePrice, setPurchasePrice] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  // New product form state
  const [newName, setNewName] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newKind, setNewKind] = useState('skincare')
  const [newUnit] = useState('flacon pompe')
  const [newBrandConfirmed, setNewBrandConfirmed] = useState(false)

  const createProduct = useCreateProduct()
  const addUserProduct = useCreateUserProduct()
  const addPurchase = useAddPurchase()

  // Duplicate detection
  const [debouncedNewName, setDebouncedNewName] = useState('')
  const [debouncedNewBrand, setDebouncedNewBrand] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNewName(newName.trim())
      setDebouncedNewBrand(newBrand.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [newName, newBrand])

  const { data: similarProducts } = useQuery({
    ...productQueries.checkDuplicate(debouncedNewName, debouncedNewBrand),
    enabled: debouncedNewName.length >= 2 && debouncedNewBrand.length >= 1,
  })

  useScrollLock(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleAddExisting = async () => {
    if (!selectedProduct) return
    try {
      if (selectedStatus === 'in_stock') {
        const created = await addUserProduct.mutateAsync({
          productId: selectedProduct.id,
          status: 'in_stock',
        })
        await addPurchase.mutateAsync({
          userProductId: created.id,
          input: {
            purchasedAt,
            pricePaidCents: purchasePrice ? Math.round(parseFloat(purchasePrice) * 100) : undefined,
            expiresAt: expiresAt || undefined,
          },
        })
      } else {
        await addUserProduct.mutateAsync({
          productId: selectedProduct.id,
          status: selectedStatus,
        })
      }
      toast.success(`${selectedProduct.name} ajouté à votre collection !`)
      onClose()
    } catch (error) {
      console.error('Failed to add product:', error)
      toast.error("Impossible d'ajouter le produit à votre collection.")
    }
  }

  const handleCreateAndAdd = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const product = await createProduct.mutateAsync({
        name: newName,
        brand: newBrand,
        kind: newKind,
        unit: newUnit,
      })

      if (selectedStatus === 'in_stock') {
        const created = await addUserProduct.mutateAsync({
          productId: product.id,
          status: 'in_stock',
        })
        await addPurchase.mutateAsync({
          userProductId: created.id,
          input: {
            purchasedAt,
            pricePaidCents: purchasePrice ? Math.round(parseFloat(purchasePrice) * 100) : undefined,
            expiresAt: expiresAt || undefined,
          },
        })
      } else {
        await addUserProduct.mutateAsync({
          productId: product.id,
          status: selectedStatus,
        })
      }
      toast.success(`${newName} créé et ajouté à votre collection !`)
      onClose()
    } catch (error) {
      console.error('Failed to create and add product:', error)
      toast.error("Impossible de créer ou d'ajouter le produit.")
    }
  }

  return (
    <div className="qa-modal-overlay">
      <button
        type="button"
        className="qa-backdrop"
        onClick={onClose}
        aria-label="Fermer la fenêtre"
      />
      <div className="qa-modal" role="dialog" aria-modal="true" aria-labelledby="qa-modal-title">
        <div className="qa-modal-header">
          <h2 id="qa-modal-title">AJOUTER À MA COLLECTION</h2>
          <button type="button" className="qa-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="qa-modal-content">
          <div className="qa-tabs">
            <button
              type="button"
              className={clsx('qa-tab', activeTab === 'existing' && 'active')}
              onClick={() => setActiveTab('existing')}
            >
              Produit existant
            </button>
            <button
              type="button"
              className={clsx('qa-tab', activeTab === 'new' && 'active')}
              onClick={() => setActiveTab('new')}
            >
              Nouveau produit
            </button>
          </div>

          {activeTab === 'existing' ? (
            <div className="qa-search-section">
              {!selectedProduct ? (
                <SearchCombobox
                  placeholder="Rechercher dans le catalogue..."
                  queryFn={(q) => productQueries.search(q)}
                  toResult={(item) => ({
                    id: item.id,
                    slug: item.slug,
                    label: item.name,
                    sublabel: item.brand,
                  })}
                  onSelect={(_slug, item) => {
                    setSelectedProduct({
                      id: String(item.id),
                      slug: item.slug,
                      name: item.label,
                      brand: item.sublabel ?? '',
                    })
                  }}
                />
              ) : (
                <>
                  <div className="qa-selected-product">
                    <div className="qa-prod-info">
                      <h3>{selectedProduct.name}</h3>
                      <p>{selectedProduct.brand}</p>
                    </div>
                    <button
                      type="button"
                      className="qa-change-prod"
                      onClick={() => setSelectedProduct(null)}
                    >
                      Changer
                    </button>
                  </div>

                  <div className="qa-status-grid">
                    {(Object.keys(statusLabels) as UserProductStatus[]).map((s) => {
                      const cfg = statusLabels[s]
                      const Icon = cfg.icon
                      return (
                        <button
                          key={s}
                          type="button"
                          className={clsx('qa-status-opt', selectedStatus === s && 'active')}
                          onClick={() => setSelectedStatus(s)}
                        >
                          <Icon size={18} />
                          <span>{cfg.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {selectedStatus === 'in_stock' && (
                    <div className="qa-purchase-fields">
                      <div className="qa-field">
                        <label htmlFor="qa-purchased-at">Date d'achat</label>
                        <input
                          id="qa-purchased-at"
                          type="date"
                          value={purchasedAt}
                          onChange={(e) => setPurchasedAt(e.target.value)}
                          required
                        />
                      </div>
                      <div className="qa-field">
                        <label htmlFor="qa-purchase-price">Prix payé (€) — optionnel</label>
                        <input
                          id="qa-purchase-price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                        />
                      </div>
                      <div className="qa-field">
                        <label htmlFor="qa-expires-at">Date d'expiration — optionnel</label>
                        <input
                          id="qa-expires-at"
                          type="date"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="qa-submit-btn"
                    style={{ width: '100%' }}
                    onClick={handleAddExisting}
                    disabled={addUserProduct.isPending || addPurchase.isPending}
                  >
                    {addUserProduct.isPending || addPurchase.isPending
                      ? 'Ajout...'
                      : 'Ajouter à ma collection'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <form className="qa-form" onSubmit={handleCreateAndAdd}>
              <div className="qa-field">
                <label htmlFor="qa-new-name">Nom du produit</label>
                <input
                  id="qa-new-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex: CeraVe Hydrating Cleanser"
                />
              </div>
              <div className="qa-field">
                <label htmlFor="qa-new-brand">Marque</label>
                <BrandCombobox
                  id="qa-new-brand"
                  value={newBrand}
                  onChange={(v, confirmed) => {
                    setNewBrand(v)
                    setNewBrandConfirmed(confirmed)
                  }}
                  placeholder="ex: CeraVe"
                />
              </div>
              {similarProducts && similarProducts.length > 0 && (
                <div className="qa-duplicate-warning" role="alert">
                  <p>
                    {similarProducts.length === 1
                      ? 'Un produit similaire existe déjà :'
                      : 'Des produits similaires existent déjà :'}
                  </p>
                  <ul>
                    {similarProducts.map((p) => (
                      <li key={p.id}>
                        {p.name} — {p.brand}
                      </li>
                    ))}
                  </ul>
                  <p className="qa-duplicate-hint">
                    Tu peux l'ajouter via l'onglet « Produit existant ».
                  </p>
                </div>
              )}

              <div className="qa-field">
                <label htmlFor="qa-new-kind">Catégorie</label>
                <input
                  id="qa-new-kind"
                  type="text"
                  required
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value)}
                />
              </div>

              <div className="qa-status-grid" style={{ marginTop: '0.5rem' }}>
                {(Object.keys(statusLabels) as UserProductStatus[]).map((s) => {
                  const cfg = statusLabels[s]
                  const Icon = cfg.icon
                  return (
                    <button
                      key={s}
                      type="button"
                      className={clsx('qa-status-opt', selectedStatus === s && 'active')}
                      onClick={() => setSelectedStatus(s)}
                    >
                      <Icon size={18} />
                      <span>{cfg.label}</span>
                    </button>
                  )
                })}
              </div>

              {selectedStatus === 'in_stock' && (
                <div className="qa-purchase-fields">
                  <div className="qa-field">
                    <label htmlFor="qa-new-purchased-at">Date d'achat</label>
                    <input
                      id="qa-new-purchased-at"
                      type="date"
                      value={purchasedAt}
                      onChange={(e) => setPurchasedAt(e.target.value)}
                      required
                    />
                  </div>
                  <div className="qa-field">
                    <label htmlFor="qa-new-purchase-price">Prix payé (€) — optionnel</label>
                    <input
                      id="qa-new-purchase-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                    />
                  </div>
                  <div className="qa-field">
                    <label htmlFor="qa-new-expires-at">Date d'expiration — optionnel</label>
                    <input
                      id="qa-new-expires-at"
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="qa-submit-btn"
                disabled={
                  createProduct.isPending ||
                  addUserProduct.isPending ||
                  addPurchase.isPending ||
                  !newBrand.trim() ||
                  !newBrandConfirmed
                }
              >
                {createProduct.isPending ? 'Création...' : 'Créer et ajouter'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
