import { Link } from '@tanstack/react-router'
import './PrivacyPage.css'

export function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-page__inner">
        <header className="privacy-header">
          <h1 className="privacy-title">Politique de confidentialité</h1>
          <p className="privacy-meta">Aurore — Dernière mise à jour : avril 2026</p>
        </header>

        <section className="privacy-summary">
          <h2 className="privacy-summary__title">En clair</h2>
          <p className="privacy-summary__intro">
            Votre vie privée compte. Voici l'essentiel en quelques lignes — la version juridique
            complète est disponible plus bas.
          </p>

          <div className="privacy-summary__grid">
            <div className="privacy-summary__card">
              <span className="privacy-summary__icon" aria-hidden="true">
                🔑
              </span>
              <h3 className="privacy-summary__card-title">Compte</h3>
              <p>
                Email, pseudo, avatar — le minimum pour que votre espace existe. Base légale :
                exécution du contrat.
              </p>
            </div>

            <div className="privacy-summary__card">
              <span className="privacy-summary__icon" aria-hidden="true">
                📋
              </span>
              <h3 className="privacy-summary__card-title">Vos données d'usage</h3>
              <p>
                Habitudes, produits, tâches, profil de peau — c'est le cœur du service que vous avez
                demandé. Rien n'est partagé.
              </p>
            </div>

            <div className="privacy-summary__card">
              <span className="privacy-summary__icon" aria-hidden="true">
                🤖
              </span>
              <h3 className="privacy-summary__card-title">Analyse IA</h3>
              <p>
                Mistral AI (entreprise française) — uniquement si vous l'activez. Vous pouvez
                révoquer ce consentement à tout moment.
              </p>
            </div>

            <div className="privacy-summary__card">
              <span className="privacy-summary__icon" aria-hidden="true">
                🇪🇺
              </span>
              <h3 className="privacy-summary__card-title">
                Tout reste en Europe <span aria-hidden="true">🇪🇺</span>
              </h3>
              <p>
                Serveur chez Hostinger (Lituanie, UE), médias sur Bunny CDN (Slovénie, UE), emails
                via Brevo (France). Aucune donnée ne quitte l'UE.
              </p>
            </div>

            <div className="privacy-summary__card">
              <span className="privacy-summary__icon" aria-hidden="true">
                🗑️
              </span>
              <h3 className="privacy-summary__card-title">Suppression totale</h3>
              <p>
                Vous pouvez effacer l'intégralité de votre compte et de vos données à tout moment
                depuis votre profil.
              </p>
            </div>

            <div className="privacy-summary__card">
              <span className="privacy-summary__icon" aria-hidden="true">
                🚫
              </span>
              <h3 className="privacy-summary__card-title">Ni pub, ni tracking</h3>
              <p>
                Aucune donnée publicitaire, aucun tracking comportemental, aucune revente à des
                tiers. Jamais.
              </p>
            </div>
          </div>
        </section>

        <details className="privacy-legal">
          <summary className="privacy-legal__trigger">Version juridique complète (RGPD)</summary>

          <div className="privacy-legal__content">
            <section className="privacy-block">
              <h2 className="privacy-block__title">Qui sommes-nous ?</h2>
              <p>
                Aurore est un outil personnel de suivi des habitudes et des soins, conçu pour les
                profils TDAH. Il est développé et exploité par <strong>Mathieu Schaff</strong>,
                responsable de traitement.
              </p>
              <p>
                Contact :{' '}
                <a href="mailto:contact@mathieu-schaff.eu" className="privacy-link">
                  contact@mathieu-schaff.eu
                </a>
              </p>
            </section>

            <section className="privacy-block">
              <h2 className="privacy-block__title">Données collectées</h2>
              <ul className="privacy-list">
                <li>
                  <strong>Compte :</strong> adresse email, nom d'utilisateur, avatar (photo de
                  profil facultative).
                </li>
                <li>
                  <strong>Usage :</strong> habitudes, produits cosmétiques, tâches, notes
                  personnelles, profil de peau.
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
              <h2 className="privacy-block__title">Bases légales du traitement</h2>
              <p>
                Conformément à l'
                <a
                  href="https://gdpr-info.eu/art-6-gdpr/"
                  className="privacy-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  article 6 du RGPD
                  <span className="sr-only"> (nouvelle fenêtre)</span>
                </a>
                , chaque traitement de données personnelles doit reposer sur une base légale. Voici
                celles que nous appliquons :
              </p>
              <ul className="privacy-list">
                <li>
                  <strong>Données de compte (email, username, avatar) :</strong> exécution du
                  contrat (Art. 6(1)(b)) — nécessaires pour créer et gérer votre compte.
                </li>
                <li>
                  <strong>Données d'usage (habitudes, produits, tâches, profil de peau) :</strong>{' '}
                  exécution du contrat (Art. 6(1)(b)) — constituent le service que vous avez
                  demandé.
                </li>
                <li>
                  <strong>Emails de confirmation :</strong> exécution du contrat (Art. 6(1)(b)) —
                  nécessaires pour vérifier votre adresse email.
                </li>
                <li>
                  <strong>Analyse IA (Mistral) :</strong> consentement explicite (Art. 6(1)(a)) —
                  uniquement si vous l'activez dans vos réglages. Vous pouvez révoquer ce
                  consentement à tout moment depuis{' '}
                  <Link to="/profile" className="privacy-link">
                    Profil → Confidentialité
                  </Link>
                  .
                </li>
                <li>
                  <strong>Logs de session et d'erreurs :</strong> intérêt légitime (Art. 6(1)(f)) —
                  sécurité et stabilité du service. Ces données sont anonymisées et ne permettent
                  pas de vous identifier.
                </li>
              </ul>
              <p className="privacy-note">
                Le RGPD (Règlement Général sur la Protection des Données) est en vigueur depuis mai
                2018 dans toute l'Union européenne. Il garantit que vos données personnelles sont
                traitées de manière transparente, pour des finalités précises, et avec votre accord
                lorsque c'est nécessaire.
              </p>
            </section>

            <section className="privacy-block">
              <h2 className="privacy-block__title">Hébergement et partenaires</h2>
              <p>
                Toutes vos données sont hébergées <strong>en Europe</strong>. Aucune donnée ne
                quitte l'Union européenne sans votre consentement explicite.
              </p>
              <ul className="privacy-list">
                <li>
                  <strong>Serveur principal :</strong> VPS Hostinger (entreprise lituanienne, UE),
                  Frankfurt, Allemagne.
                </li>
                <li>
                  <strong>Médias et CDN :</strong> Bunny CDN / Object Storage (entreprise slovène,
                  UE), infrastructure Europe uniquement.
                </li>
                <li>
                  <strong>Emails de confirmation :</strong> Brevo (anciennement Sendinblue),
                  entreprise française. Seuls les emails de confirmation de compte sont envoyés —
                  aucun email marketing.
                </li>
                <li>
                  <strong>Analyse IA (optionnel) :</strong> Mistral AI, entreprise française.
                  L'analyse de votre routine par IA n'est activée que si vous donnez votre
                  consentement explicite dans vos réglages Confidentialité. Vous pouvez le révoquer
                  à tout moment.
                </li>
              </ul>
            </section>

            <section className="privacy-block">
              <h2 className="privacy-block__title">Durée de conservation</h2>
              <p>
                Vos données sont conservées tant que votre compte est actif. À la suppression de
                votre compte, l'ensemble de vos données personnelles est définitivement supprimé de
                nos serveurs.
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
                <a href="mailto:contact@mathieu-schaff.eu" className="privacy-link">
                  contact@mathieu-schaff.eu
                </a>
              </p>
            </section>

            <section className="privacy-block">
              <h2 className="privacy-block__title">Pour aller plus loin</h2>
              <p>Sources officielles sur la protection des données personnelles :</p>
              <ul className="privacy-list">
                <li>
                  <a
                    href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees"
                    className="privacy-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNIL — Le règlement européen en 10 points
                    <span className="sr-only"> (nouvelle fenêtre)</span>
                  </a>{' '}
                  — une introduction claire au RGPD par l'autorité française de protection des
                  données.
                </li>
                <li>
                  <a
                    href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2"
                    className="privacy-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNIL — Chapitre II : Principes
                    <span className="sr-only"> (nouvelle fenêtre)</span>
                  </a>{' '}
                  — les principes fondamentaux encadrant tout traitement de données.
                </li>
                <li>
                  <a
                    href="https://gdpr-info.eu/art-6-gdpr/"
                    className="privacy-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Article 6 RGPD — Licéité du traitement
                    <span className="sr-only"> (nouvelle fenêtre)</span>
                  </a>{' '}
                  — le texte complet de l'article définissant les bases légales.
                </li>
                <li>
                  <a
                    href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679"
                    className="privacy-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Texte officiel du RGPD (EUR-Lex, version française)
                    <span className="sr-only"> (nouvelle fenêtre)</span>
                  </a>{' '}
                  — le règlement complet publié au Journal officiel de l'UE.
                </li>
              </ul>
            </section>
          </div>
        </details>
      </div>
    </div>
  )
}
