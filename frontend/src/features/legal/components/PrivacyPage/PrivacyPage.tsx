import { Link } from '@tanstack/react-router'
import './PrivacyPage.css'

export function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-page__inner">
        <header className="privacy-header">
          <h1 className="privacy-title">Politique de confidentialité</h1>
          <p className="privacy-meta">Aurore — Dernière mise à jour : avril 2025</p>
        </header>

        <section className="privacy-block">
          <h2 className="privacy-block__title">Qui sommes-nous ?</h2>
          <p>
            Aurore est un outil personnel de suivi des habitudes et des soins, conçu pour les
            profils TDAH. Il est développé et exploité par{' '}
            <strong>[Votre Prénom Nom ou Raison Sociale]</strong>, responsable de traitement.
          </p>
          <p>
            Contact :{' '}
            <a href="mailto:[votre@email.com]" className="privacy-link">
              [votre@email.com]
            </a>
          </p>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-block__title">Données collectées</h2>
          <ul className="privacy-list">
            <li>
              <strong>Compte :</strong> adresse email, nom d'utilisateur, avatar (photo de profil
              facultative).
            </li>
            <li>
              <strong>Usage :</strong> habitudes, produits cosmétiques, tâches, notes personnelles,
              profil de peau.
            </li>
            <li>
              <strong>Médias :</strong> images téléversées (stockées sur Bunny Object Storage,
              Europe).
            </li>
            <li>
              <strong>Connexion :</strong> tokens de session (cookies httpOnly), logs d'erreurs
              anonymisés.
            </li>
          </ul>
          <p>Nous ne collectons aucune donnée publicitaire ni de tracking comportemental.</p>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-block__title">Hébergement et partenaires</h2>
          <p>
            Toutes vos données sont hébergées <strong>en Europe</strong>. Aucune donnée ne quitte
            l'Union européenne sans votre consentement explicite.
          </p>
          <ul className="privacy-list">
            <li>
              <strong>Serveur principal :</strong> VPS Hostinger, Frankfurt, Allemagne (UE).
            </li>
            <li>
              <strong>Médias et CDN :</strong> Bunny CDN / Object Storage, infrastructure Europe
              uniquement.
            </li>
            <li>
              <strong>Emails de confirmation :</strong> Brevo (anciennement Sendinblue), entreprise
              française. Seuls les emails de confirmation de compte sont envoyés — aucun email
              marketing.
            </li>
            <li>
              <strong>Analyse IA (optionnel) :</strong> Mistral AI, entreprise française. L'analyse
              de votre routine par IA n'est activée que si vous donnez votre consentement explicite
              dans vos réglages Confidentialité. Vous pouvez le révoquer à tout moment.
            </li>
          </ul>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-block__title">Durée de conservation</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. À la suppression de votre
            compte, l'ensemble de vos données personnelles est définitivement supprimé de nos
            serveurs.
          </p>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-block__title">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="privacy-list">
            <li>
              <strong>Accès et rectification :</strong> consultez et modifiez vos informations
              depuis votre profil.
            </li>
            <li>
              <strong>Suppression :</strong> supprimez intégralement votre compte et vos données
              depuis{' '}
              <Link to="/profile" className="privacy-link">
                Profil → Compte → Supprimer mon compte
              </Link>
              .
            </li>
            <li>
              <strong>Portabilité et opposition :</strong> contactez-nous par email pour toute
              demande.
            </li>
          </ul>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-block__title">Contact</h2>
          <p>
            Pour toute question relative à vos données personnelles :{' '}
            <a href="mailto:[votre@email.com]" className="privacy-link">
              [votre@email.com]
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
