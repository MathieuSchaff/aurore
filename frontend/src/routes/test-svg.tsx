import { createFileRoute } from '@tanstack/react-router'
import { Droplets, FlaskConical, Package, Pill, Sun } from 'lucide-react'
import { useState } from 'react'

import { PageTitle } from '@/component/Typography/PageTitle/PageTitle'
import * as Icons from '../assets/icons'
import * as ProdIcons from '../assets/product-icons'
import { Input } from '../component/Input/Input'

export const Route = createFileRoute('/test-svg')({
  component: TestSvgPage,
})

const LUCIDE_ICONS = {
  Droplets,
  FlaskConical,
  Package,
  Pill,
  Sun,
}

function TestSvgPage() {
  const [size, setSize] = useState(64)
  const [strokeWidth, setStrokeWidth] = useState(1.75)
  const [color, setColor] = useState('#6366f1')

  const customIcons = Object.entries(Icons).filter(
    ([name]) => name.endsWith('Icon') || /Icon[A-E]$/.test(name)
  )
  const prodIcons = Object.entries(ProdIcons).filter(([name]) => name.startsWith('Prod'))

  // biome-ignore lint/suspicious/noExplicitAny: icon components have varying prop shapes
  const renderIconCard = (name: string, IconComponent: any) => (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover effects
    <div
      key={name}
      role="presentation"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* @ts-ignore */}
        <IconComponent size={size} strokeWidth={strokeWidth} />
      </div>
      <span
        style={{ fontWeight: '500', fontSize: '0.8rem', color: '#374151', textAlign: 'center' }}
      >
        {name}
      </span>
    </div>
  )

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
      }}
    >
      <header
        style={{ marginBottom: '3rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}
      >
        <PageTitle
          title="Laboratoire d'Icônes"
          subtitle="Explorez toutes les variantes d'icônes SVG du projet."
        />
      </header>

      <section
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '3rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label
            htmlFor="svg-size"
            style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}
          >
            Taille
          </label>
          <Input
            id="svg-size"
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label
            htmlFor="svg-stroke"
            style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}
          >
            Epaisseur
          </label>
          <Input
            id="svg-stroke"
            type="number"
            step="0.25"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label
            htmlFor="svg-color"
            style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}
          >
            Couleur
          </label>
          <Input
            id="svg-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '100px', padding: '0.2rem' }}
          />
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <section>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              borderLeft: `4px solid ${color}`,
              paddingLeft: '1rem',
            }}
          >
            Icônes Métier (Aurore)
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {customIcons.map(([name, IconComponent]) => renderIconCard(name, IconComponent))}
          </div>
        </section>

        <section>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              borderLeft: `4px solid ${color}`,
              paddingLeft: '1rem',
            }}
          >
            Icônes Produits
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {prodIcons.map(([name, IconComponent]) => renderIconCard(name, IconComponent))}
          </div>
        </section>

        <section>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              borderLeft: `4px solid ${color}`,
              paddingLeft: '1rem',
            }}
          >
            Lucide Icons (Référence)
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {Object.entries(LUCIDE_ICONS).map(([name, IconComponent]) =>
              renderIconCard(name, IconComponent)
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
