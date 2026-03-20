# Questions & Réponses

---

## Partie 1 — Préparation du service d'authentification

**Question : Pourquoi l'application n'a-t-elle pas besoin de stocker directement les mots de passe ?**

L'application ne stocke pas les mots de passe car c'est Firebase qui gère l'authentification. L'app envoie juste l'email/mot de passe à Firebase, puis reçoit le résultat.


## Partie 2 — Création de comptes depuis la console puis test du formulaire de connexion

**Question : L'utilisateur existe-t-il dans l'application ou chez le fournisseur ?**

L'utilisateur existe surtout chez le fournisseur d'identité (Firebase/Auth, ou Google). Dans l'application, on garde plutôt des données métier (profil, dashboard, etc.).


 **Question : Que contrôle encore l'application cliente ?**

L'application cliente contrôle encore les formulaires (validation, messages d'erreur), l'accès aux pages (rediriger si non connecté) et l'expérience utilisateur (UI/UX).


## Partie 3 — Création de compte depuis l'application

**Question : En quoi la création de compte depuis l'application change-t-elle le rôle de l'application ?**

Quand on crée un compte depuis l'app, son rôle devient plus actif : elle collecte les infos, fait des vérifications, appelle Firebase, gère les retours et la redirection.


**Question : Pourquoi faut-il valider les champs côté client même si Firebase vérifie déjà certaines contraintes ?**

On valide les champs côté client car l'utilisateur a un retour immédiat, on évite des appels inutiles au serveur, et l'interface est plus claire.


## Partie 4 — Politique de mot de passe

**Question : Une politique plus stricte améliore-t-elle toujours la sécurité réelle ?**

Non, pas toujours. Si les règles sont trop compliquées, les utilisateurs choisissent des mots de passe prévisibles ou les notent.


**Question : Quel est le risque d'un mot de passe "conforme" mais réutilisé ailleurs ?**

 Si un autre site est piraté, ce mot de passe peut être réutilisé pour entrer dans ce compte aussi (credential stuffing).



## Partie 6 — Extension facultative : Fournisseurs fédérés

**Question : Quelle différence entre un compte local Firebase email/mot de passe et une authentification fédérée ?**

Un compte local Firebase (email/mot de passe) est géré dans Firebase. Une authentification fédérée passe par un compte externe comme Google.


**Question : L'application connaît-elle le mot de passe Google de l'utilisateur ?**

Non. Le mot de passe Google est saisi et vérifié chez Google, pas dans l'application.

---

## TD Reflection sur un passage de Authentication a ProSanteConnect


**1. Dans l’application Firebase actuelle, quelles fonctionnalités dépendent d’un “compte local géré par le fournisseur” ?**

Le formulaire email/mot de passe, la création de compte email/mot de passe, et le lien “mot de passe oublié” dépendent d’un compte local géré par Firebase. Ce modèle repose sur des comptes stockés dans le projet Firebase.

**2. Si on remplace Firebase par Pro Santé Connect, quels écrans deviennent inadaptés ou doivent être repensés ?**

Les écrans “connexion locale”, “création de compte locale” et “mot de passe oublié” deviennent inadaptés. Avec PSC, l’authentification est déléguée par redirection OIDC vers le fournisseur d’identité.

**3. Qu’est-ce que l’application devrait faire à la place d’un formulaire de connexion local ?**

Afficher un bouton de connexion PSC, rediriger vers l’authorization endpoint PSC, recevoir un code de retour sur l’URL de redirection, puis échanger ce code au token endpoint pour obtenir les jetons.

**4. Quelles nouvelles informations techniques faudrait-il configurer côté application ?**

Il faut au minimum configurer : client_id, client_secret, redirect_uri (callback), endpoints OIDC (authorization/token/userinfo), scopes, et la configuration de l’environnement d’intégration PSC.

**5. Qu’est-ce qui change dans la responsabilité de l’application ?**

L’application ne gère plus les mots de passe ni le reset. Elle doit surtout gérer correctement le flux OIDC (redirection, gestion des tokens, session, logout, sécurisation des échanges).

**6. Que peut-on conserver malgré tout de l’application Firebase actuelle ?**

On peut conserver l’interface générale, les pages métier, le contrôle d’accès côté application, les messages utilisateur, et la logique après connexion (dashboard, déconnexion). On remplace surtout la partie d’authentification.

**7. Pourquoi le passage à PSC est-il plus lourd qu’un simple changement de SDK ?**

Parce qu’on change de modèle : on passe de fonctions SDK directes (email/password/reset) à une intégration complète OIDC/OAuth2 avec prérequis de raccordement, configuration de client, endpoints, sécurité TLS, gestion des jetons JWT et parcours de redirection.
