# Politique de Confidentialité

Dernière mise à jour : 2 avril 2026

Cette Politique de Confidentialité décrit comment **Aurore** (l'application) collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).

---

## 1. Données collectées

Nous collectons les informations suivantes pour assurer le bon fonctionnement de l'application :

### Données d'identification
*   **Email :** Utilisé pour la création de compte, la connexion et la vérification de sécurité.
*   **Identifiant Google (si applicable) :** Si vous choisissez la connexion via Google (OAuth).
*   **Mot de passe :** Stocké de manière sécurisée sous forme de condensat (hash) via Argon2.

### Données de Profil et d'Usage
*   **Profil Public :** Nom d'utilisateur, biographie, liens (visibles par les autres utilisateurs si vous le choisissez).
*   **Suivi des Habitudes :** Vos tâches, produits utilisés, journaux de bord (logs) et tags associés.

### Données Sensibles (Dermatologiques)
*   **Profil de peau :** Type de peau, score de Fitzpatrick, préoccupations cutanées et notes privées.
*   **Note :** Ces données sont considérées comme des données de santé. Elles ne sont traitées qu'avec votre consentement explicite pour vous fournir des recommandations personnalisées.

---

## 2. Finalités du traitement

Vos données sont traitées pour les raisons suivantes :
1.  **Gestion du compte :** Authentification et sécurisation de votre accès.
2.  **Personnalisation :** Adaptation des conseils et du suivi en fonction de votre profil dermatologique.
3.  **Amélioration du service :** Analyse anonymisée des usages pour améliorer l'application.

---

## 3. Utilisation des Cookies

L'application utilise uniquement des cookies **strictement nécessaires** au fonctionnement technique et à la sécurité. Aucun cookie de pistage publicitaire n'est utilisé.

*   `refresh_token` : Permet de maintenir votre session active de manière sécurisée (HttpOnly, Secure).
*   `google_oauth_state` / `google_code_verifier` : Utilisés temporairement lors de la connexion via Google pour prévenir les attaques de type CSRF.

---

## 4. Conservation et Suppression des données

*   **Compte actif :** Les données sont conservées tant que le compte est actif.
*   **Inactivité :** Les comptes inactifs depuis plus de 3 ans sont supprimés.
*   **Suppression définitive :** Lorsque vous choisissez de supprimer votre compte via les paramètres de l'application, **l'intégralité de vos données personnelles est immédiatement et définitivement effacée** de nos bases de données (profil, historique de produits, logs, habitudes). Cette action est irréversible.

---

## 5. Destinataires des données

Vos données ne sont jamais vendues à des tiers. Elles sont uniquement accessibles par :
*   **L'équipe technique d'Aurore** (pour la maintenance).
*   **Nos sous-traitants techniques** (Hébergeur de base de données, service d'envoi d'emails), uniquement dans le cadre de leur mission.

---

## 6. Vos Droits (RGPD) et Autonomie

Conformément au RGPD, vous disposez d'un contrôle total sur vos données directement depuis l'interface de l'application, sans avoir à nous contacter :

*   **Droit d'accès et de rectification :** Vous pouvez consulter et modifier toutes vos informations personnelles (email, profil, préférences) directement dans vos paramètres.
*   **Droit à l'effacement :** Vous pouvez déclencher la suppression totale de votre compte et de vos données à tout moment via le bouton "Supprimer mon compte".
*   **Droit à la portabilité :** Vous pouvez générer et télécharger un export complet de vos données au format JSON directement depuis votre profil.
*   **Droit d'opposition :** Vous pouvez retirer votre consentement au traitement des données de santé en supprimant votre profil dermatologique.

---

## 7. Sécurité

Nous mettons en œuvre des mesures techniques et organisationnelles (chiffrement, tokens JWT, cookies sécurisés) pour protéger vos données contre tout accès non autorisé ou perte accidentelle.
