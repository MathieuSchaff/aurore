import { createFileRoute } from '@tanstack/react-router'
import { Droplets, FlaskConical, Package, Pill, Sun } from 'lucide-react'
import { useState } from 'react'

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

  const renderIconCard = (name: string, IconComponent: any) => (
    <div
      key={name}
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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#111827' }}>
          Laboratoire d'Icônes
        </h1>
        <p style={{ color: '#4b5563' }}>Explorez toutes les variantes d'icônes SVG du projet.</p>
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
        <Input
          label="Taille (px)"
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ width: '120px' }}
        />
        <Input
          label="Épaisseur (strokeWidth)"
          type="number"
          step="0.1"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          style={{ width: '120px' }}
        />
        <div className="input-wrapper">
          <label className="input-label">Couleur</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '40px',
                height: '40px',
                padding: '2px',
                cursor: 'pointer',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
              }}
            />
            <code
              style={{
                fontSize: '0.9rem',
                color: '#4b5563',
                backgroundColor: '#f3f4f6',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              {color}
            </code>
          </div>
        </div>
      </section>

      <div style={{ marginBottom: '4rem' }}>
        <h2
          style={{
            marginBottom: '1.5rem',
            fontSize: '1.8rem',
            color: '#b45309',
            borderLeft: '4px solid #b45309',
            paddingLeft: '1rem',
          }}
        >
          Expérience : Pot de Crème Haute Couture
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '5rem',
            backgroundColor: '#fafafa',
            borderRadius: '32px',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          {/* Nouveau Clip-Path plus précis */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <clipPath id="luxury-jar-clip" clipPathUnits="objectBoundingBox">
                {/* Couvercle : rectangle légèrement arrondi en haut */}
                <path d="M 0.2 0.05 Q 0.5 0.0 0.8 0.05 L 0.85 0.25 L 0.15 0.25 Z" />
                {/* Corps du pot : forme évasée avec base très arrondie */}
                <path d="M 0.1 0.27 L 0.9 0.27 L 0.9 0.8 Q 0.9 1.0 0.5 1.0 Q 0.1 1.0 0.1 0.8 Z" />
              </clipPath>
            </defs>
          </svg>

          <div
            style={{
              position: 'relative',
              width: '450px',
              height: '550px',
              filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.15))',
            }}
          >
            {/* Le conteneur principal avec le clip-path */}
            <div
              style={{
                width: '100%',
                height: '100%',
                clipPath: 'url(#luxury-jar-clip)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              {/* SECTION COUVERCLE : Effet Métal Doré */}
              <div
                style={{
                  height: '27%',
                  width: '100%',
                  background:
                    'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.2)',
                }}
              >
                <span
                  style={{
                    color: '#5c4416',
                    fontWeight: '900',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                  }}
                >
                  Aurore
                </span>
              </div>

              {/* SECTION CORPS : Blanc Crème / Verre dépoli */}
              <div
                style={{
                  height: '73%',
                  width: '100%',
                  background: 'linear-gradient(to bottom, #ffffff 0%, #f3f4f6 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  color: '#1f2937',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Brillance sur le côté du verre */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '10%',
                    width: '15%',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.8), transparent)',
                    pointerEvents: 'none',
                  }}
                ></div>

                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3rem',
                    margin: '0 0 1rem 0',
                    color: '#9ca3af',
                  }}
                >
                  Laboratoires
                </p>

                <h3
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    margin: '0',
                    lineHeight: '0.9',
                    color: '#111827',
                  }}
                >
                  CRÈME
                  <br />
                  PRÉCIEUSE
                </h3>

                <p
                  style={{
                    fontSize: '1.2rem',
                    margin: '1.5rem 0',
                    color: '#4b5563',
                    fontStyle: 'italic',
                  }}
                >
                  Régénération Intense
                </p>

                <div
                  style={{
                    height: '1px',
                    width: '100px',
                    backgroundColor: '#d1d5db',
                    margin: '1rem 0',
                  }}
                ></div>

                <p style={{ fontSize: '3rem', fontWeight: '900', color: '#b45309', margin: '0' }}>
                  125€
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '4rem' }}>
        <h2
          style={{
            marginBottom: '1.5rem',
            fontSize: '1.8rem',
            color: '#1f2937',
            borderLeft: '4px solid #6366f1',
            paddingLeft: '1rem',
          }}
        >
          Variantes Alternatives (icons.tsx)
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
      </div>

      <div style={{ marginBottom: '4rem' }}>
        <h2
          style={{
            marginBottom: '1.5rem',
            fontSize: '1.8rem',
            color: '#1f2937',
            borderLeft: '4px solid #10b981',
            paddingLeft: '1rem',
          }}
        >
          Icônes de Production (product-icons.tsx)
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
      </div>

      <div>
        <h2
          style={{
            marginBottom: '1.5rem',
            fontSize: '1.8rem',
            color: '#1f2937',
            borderLeft: '4px solid #f59e0b',
            paddingLeft: '1rem',
          }}
        >
          Icônes Lucide (Fallbacks)
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Object.entries(LUCIDE_ICONS).map(([name, Icon]) => renderIconCard(name, Icon))}
        </div>
      </div>

      <footer
        style={{
          marginTop: '5rem',
          padding: '3rem',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem',
        }}
      >
        Projet Habit Tracker - Galerie d'Icônes SVG
      </footer>
    </div>
  )
}
