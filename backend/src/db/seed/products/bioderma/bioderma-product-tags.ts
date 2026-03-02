import { TAG_SLUGS } from '../../tags/seed-tags'
import { BIODERMA_PRODUCT_SLUGS } from './bioderma'

interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export const BIODERMA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_ATODERM_CREME_ULTRA]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.PEAU_SECHE],
    secondary: [
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PROTECTION_CUTANEE,
      TAG_SLUGS.SOIN_DE_JOUR,
    ],
    avoid: [],
  },

  [BIODERMA_PRODUCT_SLUGS.BIODERMA_ATODERM_PP_BAUME]: {
    primary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.ECZEMA],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },
  // ── Créaline Defensive Riche (peaux sèches à très sèches, sensibles/sensibilisées, apaisante riche, hydratation 12h, renforce auto-défense/barrière)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_DEFENSIVE_RICHE]: {
    primary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.CREME_HYDRATANTE,
    ],
    secondary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPARATEUR, TAG_SLUGS.TEXTURE_RICHE],
    avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE],
  },

  // ── Créaline Defensive Légère (peaux normales à mixtes, sensibles/sensibilisées, apaisante légère, même tech défensive, jour/sous maquillage)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_DEFENSIVE_LEGERE]: {
    primary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.CREME_HYDRATANTE,
    ],
    secondary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.TEXTURE_LEGERE, TAG_SLUGS.SOIN_DE_JOUR],
    avoid: [TAG_SLUGS.PEAU_SECHE],
  },

  // ── Créaline Défensive (texture légère, renforce l'auto-défense cutanée, peaux réactives)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_DEFENSIVE]: {
    primary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTI_OXYDANT],
    avoid: [],
  },

  // ── Créaline AR+ Crème (anti-rougeurs intense, Rosactiv 2.0, lipides biomimétiques, rosacée/couperose)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_AR_PLUS]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.COUPEROSE,
      TAG_SLUGS.CREME_HYDRATANTE,
    ],
    secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.BIOMIMETIQUE],
    avoid: [],
  },

  // ── Créaline Gel moussant (nettoyant doux, sans savon, peaux sensibles)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_GEL_MOUSSANT]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_SAVON],
    secondary: [TAG_SLUGS.SANS_PARFUM, TAG_SLUGS.APAISANT],
    avoid: [],
  },

  // ── Créaline Fort (action rapide rougeurs mécaniques/solaires, enoxolone, allantoine)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_FORT]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.FLUSHS],
    secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.APAISANT],
    avoid: [],
  },

  // ── Créaline DS+ Crème (dermite séborrhéique, anti-fongique, rougeurs + squames, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_DS_PLUS]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTISEPTIQUE],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Créaline Huile micellaire (nettoyant/démaquillant, peaux sensibles et réactives)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_HUILE_MICELLAIRE]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.HUILE],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.DEMAQUILLANT],
    avoid: [],
  },

  // ── Créaline H2O (eau micellaire nettoyante, sans rinçage, peaux sensibles, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CREALINE_H2O]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_PARFUM],
    secondary: [TAG_SLUGS.DEMAQUILLANT, TAG_SLUGS.HYPOALLERGENIQUE],
    avoid: [],
  },

  // ── Cicabio Crème+ (ultra-réparateur, microbiome, effet pansement, peaux abîmées/irritées/lésées)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_CREME_PLUS]: {
    primary: [
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.MICROBIOME,
      TAG_SLUGS.CICATRISATION,
    ],
    avoid: [],
  },

  // ── Cicabio Crème+ SPF50+ (réparateur + protection solaire, anti-taches post-lésions)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_CREME_PLUS_SPF50]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.REPARATEUR],
    secondary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.CICATRISATION],
    avoid: [],
  },

  // ── Cicabio Crème (réparateur, restauration barrière, peaux réactives, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_CREME]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.SANS_PARFUM],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.CICATRISATION],
    avoid: [],
  },

  // ── Cicabio Baume Lavant (nettoyant réparateur, sans savon, peaux agressées)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_BAUME_LAVANT]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.REPARATEUR, TAG_SLUGS.SANS_SAVON],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.APAISANT],
    avoid: [],
  },

  // ── Cicabio Restor (réparateur, restauration barrière, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_RESTOR]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.SANS_PARFUM],
    secondary: [TAG_SLUGS.OCCLUSIF, TAG_SLUGS.CICATRISATION],
    avoid: [],
  },

  // ── Cicabio Soin Réparateur Isolant (réparateur occlusif, résveratrol+cuivre, peaux réactives)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_SOIN_ISOLANT]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.OCCLUSIF, TAG_SLUGS.PEAU_REACTIVE],
    secondary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.CICATRISATION],
    avoid: [],
  },

  // ── Cicabio Arnica+ (réparateur post-choc, peaux réactives)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_CICABIO_ARNICA]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.PEAU_REACTIVE],
    secondary: [TAG_SLUGS.APAISANT],
    avoid: [],
  },

  // ── Sensibio AR+ (anti-rougeurs haute tolérance, Rosactiv™ 2.0, sans parfum, base maquillage)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SENSIBIO_AR]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.COUPEROSE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.SOIN_DE_JOUR],
    avoid: [],
  },

  // ── Atoderm Huile de douche (lavant relipidant, peaux sèches à atopiques, 24h hydratation)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_ATODERM_HUILE_DOUCHE]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.HUILE],
    secondary: [TAG_SLUGS.SANS_SAVON, TAG_SLUGS.EMOLLIENT],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Atoderm Intensive gel-crème (hydratant, peaux atopiques et sèches, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_ATODERM_INTENSIVE_GEL_CREME]: {
    primary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.ECZEMA],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Atoderm Intensive eye (contour yeux, réparateur, peaux atopiques, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_ATODERM_INTENSIVE_EYE]: {
    primary: [TAG_SLUGS.CONTOUR_YEUX, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.SANS_PARFUM],
    secondary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.PEAU_SECHE],
    avoid: [],
  },

  // ── Atoderm Intensive baume (émollient intensif, peaux atopiques, sans parfum)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_ATODERM_INTENSIVE_BAUME]: {
    primary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.ECZEMA],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Pigmentbio Sensitive Areas (anti-taches zones sensibles, hyperpigmentation, peaux sensibles)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_PIGMENTBIO_SENSITIVE_AREAS]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [TAG_SLUGS.ECLAT],
    avoid: [],
  },

  // ── Sébium Gel Moussant (nettoyant peaux grasses/mixtes, sébo-régulateur, sans savon)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SEBIUM_GEL_MOUSSANT]: {
    primary: [
      TAG_SLUGS.NETTOYANT,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.SANS_SAVON,
    ],
    secondary: [TAG_SLUGS.SEBO_REGULATEUR, TAG_SLUGS.ANTI_ACNE],
    avoid: [TAG_SLUGS.PEAU_SECHE],
  },

  // ── Sébium Kerato+ (exfoliant kératolytique, peaux grasses acnéiques)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SEBIUM_KERATO_PLUS]: {
    primary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.EXFOLIANT,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.PEAU_GRASSE,
    ],
    secondary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.SEBO_REGULATEUR],
    avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_SENSIBLE],
  },

  // ── Sébium Hydra Cleanser (nettoyant doux post-acné, peaux réactives sous traitement)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SEBIUM_HYDRA_CLEANSER]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.POST_ACNE],
    secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_SAVON],
    avoid: [],
  },

  // ── Sébium H2O (eau micellaire sébo-régulatrice, peaux grasses)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SEBIUM_H2O]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.SEBO_REGULATEUR],
    secondary: [TAG_SLUGS.PEAU_MIXTE, TAG_SLUGS.DEMAQUILLANT],
    avoid: [],
  },

  // ── Sébium Hydra (hydratant post-acné, peaux déshydratées sous traitement)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SEBIUM_HYDRA]: {
    primary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.POST_ACNE],
    secondary: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE],
    avoid: [],
  },

  // ── Sébium Sensitive (anti-acné peaux sensibles, anti-rougeurs)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_SEBIUM_SENSITIVE]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTI_ROUGEURS],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.SOIN_DE_JOUR],
    avoid: [],
  },

  // ── Photoderm XDEFENSE SPF50+ (protection solaire anti-oxydante, peaux sensibles)
  [BIODERMA_PRODUCT_SLUGS.BIODERMA_PHOTODERM_XDEFENSE_SPF50]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.SOIN_DE_JOUR],
    avoid: [],
  },
}
