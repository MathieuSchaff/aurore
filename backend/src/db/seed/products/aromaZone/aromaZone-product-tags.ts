import { TAG_SLUGS } from '../../tags/seed-tags'
import { AZ_PRODUCT_SLUGS } from './aromaZone'

interface ProductTagGroups {
  primary: string[] // Actions / bénéfices principaux (souvent des concerns)
  secondary: string[] // Type de produit, labels, propriétés fonctionnelles, etc.
  avoid: string[] // Situations / types de peau où le produit est déconseillé ou risqué
}

export const AZ_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Sérum Concentré Acide Azélaïque 10% ──────────────────────────────────────
  // Focus : imperfections, séborégulation, matité, rougeurs légères
  [AZ_PRODUCT_SLUGS.AROMA_ZONE_CONCENTRE_AZELAIC_10]: {
    primary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.BRILLANCE,
      TAG_SLUGS.ANTI_ROUGEURS, // azélaïque souvent utile sur rosacée légère
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.KERATOLYTIQUE, // grâce à l'extrait saule + azélaïque
      TAG_SLUGS.ASTRINGENT,
      TAG_SLUGS.TRAITEMENT, // étape traitement actif
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.BARRIERE_CUTANEE, // anciennement BARRIERE_CUTANEE_ALTEREE → slug actuel
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE, // on garde les deux si vous acceptez l'ancien temporairement
      TAG_SLUGS.PEAU_REACTIVE, // picotements possibles
    ],
  },

  // ── Sérum Concentré Vitamine C 10% & Astaxanthine ────────────────────────────
  // Focus : antioxydant, éclat, taches, photo-vieillissement
  [AZ_PRODUCT_SLUGS.AZ_SERUM_VITAMINE_C_10_ASTAXANTHINE]: {
    primary: [
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.PHOTO_VIEILLISSEMENT,
    ],
    secondary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN, // vitamine C typiquement matin
    ],
    avoid: [
      // Globalement très bien toléré → presque rien
    ],
  },

  // ── Sérum Bakuchiol ──────────────────────────────────────────────────────────
  // Focus : anti-âge doux, alternative rétinol, améliore texture / marques
  [AZ_PRODUCT_SLUGS.AZ_SERUM_BAKUCHIOL]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.REPULPANT, // stimule collagène → effet repulpant
      TAG_SLUGS.POST_ACNE, // aide sur les marques
      TAG_SLUGS.CICATRISATION,
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUILE_VISAGE, // base squalane
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.EMOLLIENT, // squalane = émollient
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE, // texture huileuse peut être trop riche
      TAG_SLUGS.BRILLANCE, // risque d'effet gras sur peaux mixtes à grasses
      // Note: grossesse → débat sur bakuchiol → je n'ai pas mis GROSSESSE_COMPATIBLE en primary ni avoid car incertain
    ],
  },

  // ── Sérum Acide Hyaluronique 3,5% ────────────────────────────────────────────
  // Focus : hydratation, repulpage, confort peaux déshydratées / sensibles
  [AZ_PRODUCT_SLUGS.AZ_SERUM_HYALURONIQUE_3_5]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT, TAG_SLUGS.HUMECTANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE, // souvent très bien toléré
      TAG_SLUGS.HYDRATATION, // étape routine
      TAG_SLUGS.MATIN, // souvent utilisé matin et soir
      TAG_SLUGS.SOIR,
    ],
    avoid: [
      // Très large tolérance → quasi rien
      // (éventuellement peaux très grasses qui n'aiment pas les textures aqueuses pures, mais rare)
    ],
  },
}
