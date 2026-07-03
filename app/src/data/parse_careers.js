const fs = require('fs');

const markdown = `
## 1. SANTÉ ET SOCIAL

### Médecin généraliste
- **Description** : Diagnostique et traite les pathologies courantes, et oriente vers des spécialistes si besoin.
- **Salaire** : 250 000 à 400 000 FCFA/mois
- **Formation** : 9 à 10 ans d’études (médecine + internat)
- **Compétences techniques** : diagnostic clinique, prescription, gestes médicaux de base, dossier patient
- **Soft skills** : écoute, empathie, gestion du stress, prise de décision rapide
- **Perspectives** : forte demande, surtout en zones rurales et dans les structures privées

### Médecin spécialiste
- **Description** : Expertise approfondie dans un domaine médical précis.
- **Salaire** : 241 000 à 600 000 FCFA/mois, parfois plus en privé
- **Formation** : 10 à 12 ans (médecine + spécialisation)
- **Compétences techniques** : expertise pointue, maîtrise d’équipements spécialisés, gestes spécialisés
- **Soft skills** : précision, sang-froid, leadership, pédagogie envers les patients
- **Perspectives** : très bonnes, surtout en chirurgie, radiologie et anesthésie

### Dentiste / Chirurgien-dentiste
- **Description** : Soins des dents, gencives et mâchoires.
- **Salaire** : 250 000 à 600 000 FCFA/mois
- **Formation** : 6 ans d’études dentaires
- **Compétences techniques** : soins bucco-dentaires, prothèses, radiologie dentaire
- **Soft skills** : minutie, capacité à rassurer les patients anxieux
- **Perspectives** : bonnes, demande stable

### Pharmacien(ne)
- **Description** : Délivre des médicaments, conseille les patients et peut gérer une officine.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : 6 ans d’études de pharmacie
- **Compétences techniques** : pharmacologie, gestion des stocks, réglementation
- **Soft skills** : rigueur, sens du conseil, discrétion
- **Perspectives** : stables, avec des débouchés en officine, industrie et distribution

### Kinésithérapeute
- **Description** : Rééducation fonctionnelle et traitement des troubles musculo-squelettiques.
- **Salaire** : 250 000 à 500 000 FCFA/mois
- **Formation** : 5 ans
- **Compétences techniques** : techniques manuelles, rééducation, bilan fonctionnel
- **Soft skills** : patience, sens du contact, pédagogie
- **Perspectives** : bonnes, demande croissante

### Psychologue
- **Description** : Évalue et accompagne les troubles psychiques et émotionnels.
- **Salaire** : 150 000 à 450 000 FCFA/mois
- **Formation** : 5 ans (Master en psychologie)
- **Compétences techniques** : tests psychométriques, entretiens, rédaction de bilans
- **Soft skills** : écoute active, empathie, neutralité bienveillante
- **Perspectives** : en croissance, notamment dans les écoles, ONG et cliniques

### Psychiatre
- **Description** : Médecin spécialisé dans les troubles mentaux, avec possibilité de prescription.
- **Salaire** : 241 000 à 600 000 FCFA/mois
- **Formation** : 10 à 11 ans
- **Compétences techniques** : diagnostic psychiatrique, prescription, psychothérapie
- **Soft skills** : empathie, patience, gestion des situations de crise
- **Perspectives** : très bonnes, praticiens encore peu nombreux

### Sage-femme
- **Description** : Suivi de grossesse, accouchement et soins postnataux.
- **Salaire** : 120 000 à 250 000 FCFA/mois
- **Formation** : 5 ans
- **Compétences techniques** : suivi obstétrical, gestes d’urgence, accompagnement à l’accouchement
- **Soft skills** : sang-froid, réconfort, communication
- **Perspectives** : bonnes, besoin important dans les formations sanitaires

### Infirmier(ère)
- **Description** : Soins aux patients, administration des traitements et suivi médical.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : 3 ans
- **Compétences techniques** : actes infirmiers, perfusion, surveillance clinique
- **Soft skills** : résistance au stress, empathie, travail d’équipe
- **Perspectives** : très forte demande

### Aide-soignant(e)
- **Description** : Assiste les infirmiers dans les soins quotidiens et l’hygiène des patients.
- **Salaire** : 80 000 à 180 000 FCFA/mois
- **Formation** : formation courte ou diplôme spécialisé
- **Compétences techniques** : hygiène, soins de confort, aide à la mobilité
- **Soft skills** : douceur, patience, disponibilité
- **Perspectives** : très bonnes, secteur en tension

### Ambulancier(ère)
- **Description** : Transport médicalisé de patients.
- **Salaire** : 80 000 à 180 000 FCFA/mois
- **Formation** : diplôme d’ambulancier ou formation équivalente
- **Compétences techniques** : conduite, premiers secours, manipulation de matériel médical
- **Soft skills** : calme sous pression, réactivité
- **Perspectives** : stables

### Vétérinaire
- **Description** : Soigne les animaux, prévention et chirurgie.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : 6 à 8 ans
- **Compétences techniques** : diagnostic animalier, chirurgie, pharmacologie vétérinaire
- **Soft skills** : empathie, sang-froid
- **Perspectives** : bonnes, surtout en zones rurales

### Nutritionniste / Diététicien(ne)
- **Description** : Conseille sur l’alimentation pour la santé ou des objectifs spécifiques.
- **Salaire** : 150 000 à 400 000 FCFA/mois
- **Formation** : BTS à Master selon la spécialité
- **Compétences techniques** : calcul nutritionnel, plans alimentaires
- **Soft skills** : pédagogie, motivation, écoute
- **Perspectives** : croissance liée à la santé et au bien-être

### Ergothérapeute
- **Description** : Aide à l’autonomie des personnes en situation de handicap ou de rééducation.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : 3 ans
- **Compétences techniques** : adaptation de l’environnement, rééducation fonctionnelle
- **Soft skills** : créativité, empathie, patience
- **Perspectives** : bonnes

### Assistant(e) social(e)
- **Description** : Accompagne les personnes en difficulté sociale, financière ou familiale.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : 3 ans
- **Compétences techniques** : connaissance des dispositifs sociaux, rédaction de dossiers
- **Soft skills** : écoute, neutralité, résistance émotionnelle
- **Perspectives** : stables, forte utilité sociale

### Éducateur(trice) spécialisé(e)
- **Description** : Accompagne des publics en difficulté (jeunes, handicap, exclusion).
- **Salaire** : 120 000 à 280 000 FCFA/mois
- **Formation** : 3 ans
- **Compétences techniques** : animation de groupe, suivi éducatif individualisé
- **Soft skills** : patience, autorité bienveillante, créativité
- **Perspectives** : bonnes

## 2. SCIENCES ET RECHERCHE

### Ingénieur(e) civil / BTP
- **Description** : Conception et supervision de la construction d’infrastructures.
- **Salaire** : 300 000 à 700 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : CAO/BIM, calcul de structures, normes du bâtiment
- **Soft skills** : gestion de projet, leadership, rigueur
- **Perspectives** : bonnes, demande liée aux infrastructures

### Ingénieur(e) mécanique
- **Description** : Conçoit des systèmes mécaniques, machines et équipements.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : CAO, simulation, thermodynamique, mécanique des fluides
- **Soft skills** : esprit d’analyse, travail en équipe
- **Perspectives** : stables

### Ingénieur(e) électrique / électronique
- **Description** : Conçoit des systèmes électriques et électroniques.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : circuits électroniques, automatisme, normes électriques
- **Soft skills** : précision, résolution de problèmes
- **Perspectives** : bonnes, liées à l’énergie et à l’industrie

### Ingénieur(e) biomédical(e)
- **Description** : Développe des équipements médicaux et technologies de santé.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : dispositifs médicaux, réglementation, normes
- **Soft skills** : rigueur, interdisciplinarité
- **Perspectives** : excellentes, secteur en croissance

### Biologiste / Microbiologiste
- **Description** : Étudie les organismes vivants en laboratoire ou sur le terrain.
- **Salaire** : 220 000 à 450 000 FCFA/mois
- **Formation** : Bac+5 à Bac+8
- **Compétences techniques** : techniques de laboratoire, analyse de données biologiques
- **Soft skills** : rigueur scientifique, patience, curiosité
- **Perspectives** : correctes

### Chimiste
- **Description** : Recherche et développement dans l’industrie chimique ou pharmaceutique.
- **Salaire** : 250 000 à 500 000 FCFA/mois
- **Formation** : Bac+5 à Bac+8
- **Compétences techniques** : synthèse chimique, analyse spectroscopique, sécurité labo
- **Soft skills** : précision, méthode
- **Perspectives** : stables

### Géologue
- **Description** : Étudie la structure de la Terre et les ressources naturelles.
- **Salaire** : 250 000 à 500 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : cartographie, analyse de sols et roches, SIG
- **Soft skills** : terrain, autonomie
- **Perspectives** : bonnes dans l’énergie, l’eau et l’environnement

### Mathématicien(ne) / Statisticien(ne)
- **Description** : Modélisation mathématique appliquée à la finance, à la data et à la recherche.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : Bac+5 à Bac+8
- **Compétences techniques** : statistiques avancées, Python, R, modélisation
- **Soft skills** : rigueur logique, communication de résultats complexes
- **Perspectives** : excellentes

## 3. INFORMATIQUE ET TECHNOLOGIE

### Développeur(euse) front-end
- **Description** : Conçoit l'interface visuelle et interactive des sites/applications web.
- **Salaire** : 150 000 à 450 000 FCFA/mois
- **Formation** : Bac+2 à Bac+5 (autodidacte possible)
- **Compétences techniques** : HTML, CSS, JavaScript, React/Vue/Angular
- **Soft skills** : créativité, sens du détail, veille technologique
- **Perspectives** : excellentes, forte demande

### Développeur(euse) back-end
- **Description** : Construit la logique serveur et les bases de données des applications.
- **Salaire** : 250 000 à 700 000 FCFA/mois
- **Formation** : Bac+2 à Bac+5
- **Compétences techniques** : Node.js, Python, Java, PHP, bases de données (SQL/NoSQL), API REST
- **Soft skills** : résolution de problèmes, logique, rigueur
- **Perspectives** : excellentes

### Développeur(euse) full-stack
- **Description** : Maîtrise à la fois le front-end et le back-end.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+3 à Bac+5
- **Compétences techniques** : large palette de langages et frameworks web
- **Soft skills** : polyvalence, autonomie, gestion du temps
- **Perspectives** : très recherché

### Développeur(euse) mobile (iOS/Android)
- **Description** : Crée des applications mobiles natives ou hybrides.
- **Salaire** : 250 000 à 700 000 FCFA/mois
- **Formation** : Bac+3 à Bac+5
- **Compétences techniques** : Swift, Kotlin, Flutter, React Native
- **Soft skills** : sens de l'UX, rigueur, créativité
- **Perspectives** : très bonnes

### Ingénieur(e) DevOps
- **Description** : Automatise et fiabilise les déploiements et infrastructures logicielles.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : Docker, Kubernetes, CI/CD, AWS/Azure/GCP, scripting
- **Soft skills** : collaboration, gestion du stress, organisation
- **Perspectives** : excellentes, l'un des postes les plus demandés

### Expert(e) en cybersécurité
- **Description** : Protège les systèmes informatiques contre les menaces.
- **Salaire** : 400 000 à 1 200 000 FCFA/mois
- **Formation** : Bac+5, certifications (CEH, CISSP)
- **Compétences techniques** : audit de sécurité, pentest, cryptographie, gestion d'incidents
- **Soft skills** : vigilance, esprit analytique, éthique
- **Perspectives** : extrêmement fortes, pénurie mondiale de talents

### Data scientist
- **Description** : Analyse de données complexes pour en extraire des insights et modèles prédictifs.
- **Salaire** : 400 000 à 1 000 000 FCFA/mois
- **Formation** : Bac+5 à Bac+8
- **Compétences techniques** : Python/R, machine learning, SQL, statistiques
- **Soft skills** : curiosité, communication de résultats, esprit critique
- **Perspectives** : excellentes

### Ingénieur(e) en intelligence artificielle / Machine learning
- **Description** : Conçoit des modèles d'IA et algorithmes d'apprentissage automatique.
- **Salaire** : 600 000 à 1 800 000 FCFA/mois
- **Formation** : Bac+5 à Bac+8
- **Compétences techniques** : deep learning, frameworks (TensorFlow, PyTorch), mathématiques avancées
- **Soft skills** : innovation, rigueur scientifique, collaboration
- **Perspectives** : en très forte croissance, l'un des métiers les plus stratégiques de la décennie

### Designer UX/UI
- **Description** : Conçoit l'expérience et l'interface utilisateur de produits numériques.
- **Salaire** : 200 000 à 600 000 FCFA/mois
- **Formation** : Bac+3 à Bac+5
- **Compétences techniques** : Figma, recherche utilisateur, prototypage, design systems
- **Soft skills** : empathie, créativité, communication
- **Perspectives** : très bonnes

### Chef(fe) de produit digital
- **Description** : Pilote la stratégie et le développement d'un produit numérique.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : Bac+5 (école de commerce/ingénieur)
- **Compétences techniques** : méthodologie agile, analyse de données, roadmap produit
- **Soft skills** : leadership, vision stratégique, communication transverse
- **Perspectives** : excellentes

## 4. BUSINESS, FINANCE ET DROIT

### Comptable
- **Description** : Tient et contrôle les comptes d’une entreprise.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : Bac+2 à Bac+5 (BTS, DCG, DSCG)
- **Compétences techniques** : logiciels comptables, fiscalité, normes comptables
- **Soft skills** : rigueur, organisation, discrétion
- **Perspectives** : stables, avec une demande régulière dans les entreprises, ONG et cabinets

### Expert(e)-comptable
- **Description** : Supervise la comptabilité et conseille les entreprises.
- **Salaire** : 400 000 à 1 500 000 FCFA/mois
- **Formation** : Bac+8 (DEC)
- **Compétences techniques** : audit, fiscalité avancée, conseil en gestion
- **Soft skills** : leadership, relation client, rigueur
- **Perspectives** : très bonnes, surtout dans les cabinets et grandes structures

### Analyste financier(ère)
- **Description** : Évalue la performance financière et les investissements.
- **Salaire** : 250 000 à 700 000 FCFA/mois
- **Formation** : Bac+5 (finance, gestion, école de commerce)
- **Compétences techniques** : modélisation financière, Excel avancé, analyse de marché
- **Soft skills** : esprit critique, résistance au stress, communication
- **Perspectives** : bonnes, secteur compétitif

### Avocat(e)
- **Description** : Conseille et défend les clients dans des affaires juridiques.
- **Salaire** : 300 000 à 1 200 000 FCFA/mois
- **Formation** : Bac+5 + CAPA
- **Compétences techniques** : droit, plaidoirie, rédaction juridique
- **Soft skills** : argumentation, sang-froid, éthique
- **Perspectives** : bonnes, surtout en droit des affaires et droit du travail

### Notaire
- **Description** : Authentifie des actes juridiques, notamment en immobilier et succession.
- **Salaire** : 500 000 à 1 500 000 FCFA/mois
- **Formation** : Bac+7/8
- **Compétences techniques** : droit civil, rédaction d’actes, conseil juridique
- **Soft skills** : rigueur, confidentialité, relation client
- **Perspectives** : stables, profession réglementée

### Consultant(e) en management/stratégie
- **Description** : Conseille les entreprises sur l’organisation et la stratégie.
- **Salaire** : 300 000 à 1 000 000 FCFA/mois
- **Formation** : Bac+5 (école de commerce ou d’ingénieur)
- **Compétences techniques** : analyse stratégique, gestion de projet, outils de data
- **Soft skills** : communication, adaptabilité, leadership
- **Perspectives** : bonnes, surtout dans les entreprises en croissance

### Entrepreneur(e)
- **Description** : Crée et développe sa propre entreprise.
- **Salaire** : très variable
- **Formation** : aucune obligatoire, mais formation en gestion utile
- **Compétences techniques** : selon le secteur, avec bases de gestion financière
- **Soft skills** : prise de risque, résilience, leadership, vision
- **Perspectives** : dépend fortement du secteur et de l’exécution

### Responsable des ressources humaines (RH)
- **Description** : Gère le recrutement, la formation et les relations sociales.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : droit du travail, SIRH, gestion de la paie
- **Soft skills** : écoute, diplomatie, gestion de conflits
- **Perspectives** : stables

### Responsable marketing
- **Description** : Définit et pilote la stratégie marketing d’une entreprise.
- **Salaire** : 350 000 à 900 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : marketing digital, analyse de données, gestion de campagnes
- **Soft skills** : créativité, leadership, esprit d’analyse
- **Perspectives** : bonnes, avec la digitalisation croissante

### Agent(e) immobilier
- **Description** : Accompagne l’achat, la vente ou la location de biens immobiliers.
- **Salaire** : 100 000 à 500 000+ FCFA/mois, souvent à la commission
- **Formation** : BTS ou expérience
- **Compétences techniques** : connaissance du marché local, négociation, droit immobilier de base
- **Soft skills** : relationnel, persuasion, ténacité
- **Perspectives** : variables selon le marché immobilier

## 5. ÉDUCATION ET FORMATION

### Professeur(e) des écoles
- **Description** : Enseigne aux élèves de primaire.
- **Salaire** : 100 000 à 200 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : pédagogie, gestion de classe, programmes scolaires
- **Soft skills** : patience, autorité bienveillante, créativité pédagogique
- **Perspectives** : stables, recrutements réguliers

### Enseignant(e) secondaire (collège/lycée)
- **Description** : Enseigne une matière spécifique au collège ou au lycée.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : Bac+5 + concours
- **Compétences techniques** : maîtrise disciplinaire, pédagogie différenciée
- **Soft skills** : gestion de groupe, communication, patience
- **Perspectives** : variables selon la discipline, avec une demande plus forte en sciences et langues

### Professeur(e) d’université / Maître de conférences
- **Description** : Enseigne et mène des recherches dans le supérieur.
- **Salaire** : 250 000 à 700 000 FCFA/mois
- **Formation** : Bac+8 (doctorat)
- **Compétences techniques** : recherche, publication scientifique, pédagogie universitaire
- **Soft skills** : rigueur intellectuelle, communication, autonomie
- **Perspectives** : postes compétitifs

### Formateur(trice) professionnel(le)
- **Description** : Forme des adultes dans un domaine spécifique.
- **Salaire** : 200 000 à 500 000 FCFA/mois
- **Formation** : variable selon la spécialité
- **Compétences techniques** : ingénierie pédagogique, expertise du domaine enseigné
- **Soft skills** : pédagogie, adaptabilité, écoute
- **Perspectives** : bonnes, formation continue en expansion

### Conseiller(ère) d’orientation
- **Description** : Accompagne les élèves et étudiants dans leurs choix d’orientation.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : connaissance des filières et métiers, outils d’évaluation
- **Soft skills** : écoute, neutralité, pédagogie
- **Perspectives** : stables

## 6. ARTS, MÉDIAS ET CRÉATION

### Graphiste / Designer graphique
- **Description** : Crée des supports visuels comme les logos, affiches et identités visuelles.
- **Salaire** : 94 057 à 415 934 FCFA/mois
- **Formation** : Bac+2 à Bac+5
- **Compétences techniques** : Photoshop, Illustrator, InDesign, typographie
- **Soft skills** : créativité, sens artistique, écoute du client
- **Perspectives** : correctes, surtout avec la demande digitale et publicitaire

### Architecte
- **Description** : Conçoit des bâtiments et des espaces, et supervise leur construction.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5/6
- **Compétences techniques** : CAO, normes du bâtiment, gestion de chantier
- **Soft skills** : créativité, gestion de projet, négociation
- **Perspectives** : bonnes, liées à l’urbanisme et à la construction

### Photographe
- **Description** : Capture des images pour divers usages : événementiel, presse, mode et communication.
- **Salaire** : 100 000 à 400 000 FCFA/mois
- **Formation** : formation technique ou autodidacte
- **Compétences techniques** : prise de vue, retouche, lumière, composition
- **Soft skills** : créativité, sens du relationnel, patience
- **Perspectives** : marché concurrentiel, avec des niches porteuses

### Réalisateur(trice) / Monteur(euse) vidéo
- **Description** : Conçoit et assemble des contenus audiovisuels.
- **Salaire** : 200 000 à 600 000 FCFA/mois
- **Formation** : école de cinéma/audiovisuel ou autodidacte
- **Compétences techniques** : montage, narration visuelle, prise de vue
- **Soft skills** : créativité, sens du rythme, gestion de projet
- **Perspectives** : bonnes, avec la forte demande en contenu vidéo

### Musicien(ne) / Compositeur(trice)
- **Description** : Crée, interprète ou produit de la musique.
- **Salaire** : très variable
- **Formation** : conservatoire ou autodidacte
- **Compétences techniques** : maîtrise instrumentale, théorie musicale, production
- **Soft skills** : créativité, persévérance, sens du réseau
- **Perspectives** : difficiles, mais opportunités via les plateformes numériques

### Écrivain(e) / Journaliste / Rédacteur(trice)
- **Description** : Rédige des contenus écrits comme livres, articles et contenus web.
- **Salaire** : très variable, souvent freelance
- **Formation** : Bac+3 à Bac+5 ou autodidacte
- **Compétences techniques** : écriture, SEO, recherche documentaire
- **Soft skills** : créativité, rigueur, curiosité
- **Perspectives** : marché concurrentiel, mais la demande en contenu reste forte

### Traducteur(trice) / Interprète
- **Description** : Traduit ou interprète des contenus d’une langue à l’autre.
- **Salaire** : 200 000 à 500 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : maîtrise de plusieurs langues, outils de TAO
- **Soft skills** : précision, concentration, culture générale
- **Perspectives** : impactées par l’IA, mais les spécialisations résistent mieux

### Créateur(trice) de contenu / Influenceur(euse)
- **Description** : Produit du contenu pour les réseaux sociaux et en tire des revenus.
- **Salaire** : extrêmement variable
- **Formation** : aucune requise
- **Compétences techniques** : création de contenu, montage, analytics des réseaux
- **Soft skills** : créativité, charisme, régularité, résilience face à la critique
- **Perspectives** : en forte croissance mais très concurrentiel

### Game designer / Développeur(euse) de jeux vidéo
- **Description** : Conçoit le gameplay et les mécaniques de jeux vidéo.
- **Salaire** : 250 000 à 700 000 FCFA/mois
- **Formation** : Bac+3 à Bac+5
- **Compétences techniques** : Unity, Unreal, programmation, level design
- **Soft skills** : créativité, travail d’équipe, sens du jeu
- **Perspectives** : bonnes, industrie en croissance continue

## 7. ARTISANAT ET MÉTIERS MANUELS

### Électricien(ne)
- **Description** : Installe et répare les systèmes électriques.
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : CAP à BTS
- **Compétences techniques** : normes électriques, lecture de schémas, domotique
- **Soft skills** : minutie, sens de la sécurité, autonomie
- **Perspectives** : excellentes (transition énergétique, rénovation)

### Plombier(ère) / Chauffagiste
- **Description** : Installe et entretient les systèmes de plomberie et chauffage.
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : CAP à BTS
- **Compétences techniques** : installation sanitaire, chauffage, pompes à chaleur
- **Soft skills** : sens pratique, relation client, fiabilité
- **Perspectives** : très bonnes, forte pénurie de main d'œuvre

### Menuisier(ère) / Ébéniste
- **Description** : Fabrique et installe des structures et meubles en bois.
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : CAP à BTS
- **Compétences techniques** : travail du bois, lecture de plans, machines-outils
- **Soft skills** : précision, créativité, patience
- **Perspectives** : bonnes, valorisation de l'artisanat

### Maçon(ne) / Couvreur(euse)
- **Description** : Construit ou rénove des bâtiments (gros œuvre, toiture).
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : CAP
- **Compétences techniques** : techniques de construction, lecture de plans, sécurité chantier
- **Soft skills** : résistance physique, travail d'équipe, rigueur
- **Perspectives** : excellentes (BTP en tension)

### Mécanicien(ne) automobile
- **Description** : Diagnostique et répare les véhicules.
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : CAP à BTS
- **Compétences techniques** : diagnostic électronique, mécanique, véhicules électriques/hybrides
- **Soft skills** : sens pratique, méthode, relation client
- **Perspectives** : en mutation (montée des véhicules électriques nécessite reconversion)

### Boulanger(ère) / Pâtissier(ère)
- **Description** : Fabrique du pain, viennoiseries ou pâtisseries.
- **Salaire** : 100 000 à 300 000 FCFA/mois (plus en tant qu'indépendant)
- **Formation** : CAP
- **Compétences techniques** : techniques de panification/pâtisserie, gestion des stocks
- **Soft skills** : rigueur, créativité, résistance physique (horaires matinaux)
- **Perspectives** : stables, métier toujours recherché

### Coiffeur(euse) / Esthéticien(ne)
- **Description** : Coiffure ou soins esthétiques pour les clients.
- **Salaire** : 80 000 à 250 000 FCFA/mois (plus en indépendant)
- **Formation** : CAP à BTS
- **Compétences techniques** : techniques de coupe/coloration ou soins du visage/corps
- **Soft skills** : relationnel, créativité, sens du détail
- **Perspectives** : stables, fort potentiel en indépendant

### Bijoutier(ère) / Horloger(ère)
- **Description** : Fabrique ou répare bijoux et montres.
- **Salaire** : 150 000 à 400 000 FCFA/mois
- **Formation** : CAP à Bac+2 spécialisé
- **Compétences techniques** : travail de précision, sertissage, mécanique horlogère
- **Soft skills** : minutie extrême, patience
- **Perspectives** : niche stable, savoir-faire recherché (luxe)

## 8. AGRICULTURE, ENVIRONNEMENT ET ÉNERGIE

### Agriculteur(trice) / Éleveur(euse)
- **Description** : Cultive des terres ou élève des animaux pour la production alimentaire.
- **Salaire** : très variable, 100 000 à 1 000 000+ FCFA/mois
- **Formation** : CAP/BTS agricole ou reprise familiale
- **Compétences techniques** : agronomie, gestion d'exploitation, machinisme agricole
- **Soft skills** : résistance physique, autonomie, gestion du risque
- **Perspectives** : secteur en mutation (agriculture durable, robotisation)

### Ingénieur(e) agronome
- **Description** : Optimise les pratiques agricoles et la production alimentaire.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : agronomie, gestion environnementale, analyse de sols
- **Soft skills** : esprit d'analyse, terrain, communication
- **Perspectives** : bonnes (agriculture durable en expansion)

### Garde forestier(ère)
- **Description** : Gère et protège les espaces forestiers.
- **Salaire** : 120 000 à 300 000 FCFA/mois
- **Formation** : Bac+2 à Bac+5
- **Compétences techniques** : sylviculture, cartographie, droit environnemental
- **Soft skills** : autonomie, sens de l'observation, résistance physique
- **Perspectives** : stables

### Spécialiste en énergies renouvelables
- **Description** : Conçoit et développe des projets solaires, éoliens, etc.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5 (ingénieur)
- **Compétences techniques** : ingénierie énergétique, gestion de projet, réglementation
- **Soft skills** : innovation, rigueur, communication
- **Perspectives** : excellentes, secteur en forte croissance

## 9. TRANSPORT ET LOGISTIQUE

### Pilote de ligne
- **Description** : Pilote des avions commerciaux.
- **Salaire** : 1 500 000 à 4 000 000+ FCFA/mois
- **Formation** : écoles de pilotage (ENAC, etc.), licence ATPL
- **Compétences techniques** : pilotage, navigation, gestion d'urgence
- **Soft skills** : sang-froid, leadership, prise de décision
- **Perspectives** : bonnes à long terme malgré la cyclicité du secteur aérien

### Conducteur(trice) de train
- **Description** : Conduit des trains de voyageurs ou de marchandises.
- **Salaire** : 200 000 à 500 000 FCFA/mois
- **Formation** : formation interne (SNCF ou équivalent)
- **Compétences techniques** : conduite ferroviaire, sécurité, procédures
- **Soft skills** : vigilance, rigueur, autonomie
- **Perspectives** : stables

### Chauffeur(euse) routier / livreur(euse)
- **Description** : Transporte des marchandises sur route.
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : permis poids lourd + FIMO
- **Compétences techniques** : conduite, réglementation transport, gestion d'itinéraire
- **Soft skills** : autonomie, ponctualité, résistance à la fatigue
- **Perspectives** : forte demande (e-commerce), mais automatisation à surveiller

### Logisticien(ne) / Responsable supply chain
- **Description** : Organise les flux de marchandises et la chaîne d'approvisionnement.
- **Salaire** : 250 000 à 700 000 FCFA/mois
- **Formation** : Bac+3 à Bac+5
- **Compétences techniques** : ERP, gestion de stocks, optimisation logistique
- **Soft skills** : organisation, gestion de crise, négociation
- **Perspectives** : bonnes, digitalisation du secteur

## 10. SÉCURITÉ ET DÉFENSE

### Policier(ère) / Gendarme
- **Description** : Assure la sécurité publique et l’application de la loi.
- **Salaire** : 85 000 à 274 604 FCFA/mois selon le grade et la fonction.
- **Formation** : concours + école de police ou de gendarmerie.
- **Compétences techniques** : procédures judiciaires, intervention, maniement d’armes selon spécialité.
- **Soft skills** : sang-froid, sens du devoir, gestion de conflit.
- **Perspectives** : stables, avec recrutements réguliers.

### Pompier(ère)
- **Description** : Intervient en cas d’incendie, accident ou secours d’urgence.
- **Salaire** : 120 000 à 239 429 FCFA/mois pour un débutant, avec progression selon l’ancienneté.
- **Formation** : concours + formation spécifique.
- **Compétences techniques** : secours, lutte contre l’incendie, premiers secours.
- **Soft skills** : courage, esprit d’équipe, résistance physique et psychologique.
- **Perspectives** : stables.

### Militaire
- **Description** : Sert dans les forces armées.
- **Salaire** : 120 000 à 350 000 FCFA/mois selon le grade.
- **Formation** : écoles militaires.
- **Compétences techniques** : tactique, maniement d’équipement militaire, selon la spécialité.
- **Soft skills** : discipline, esprit d’équipe, résilience.
- **Perspectives** : stables, recrutements continus.

### Agent(e) de sécurité privée
- **Description** : Surveille et protège des biens ou des personnes.
- **Salaire** : 80 000 à 180 000 FCFA/mois.
- **Formation** : CQP ou formation courte.
- **Compétences techniques** : surveillance, procédures de sécurité.
- **Soft skills** : vigilance, calme, autorité naturelle.
- **Perspectives** : bonnes, secteur en croissance.

## 11. HÔTELLERIE, TOURISME ET RESTAURATION

### Chef cuisinier(ère)
- **Description** : Crée et supervise la préparation des plats dans un restaurant.
- **Salaire** : 100 000 à 300 000 FCFA/mois.
- **Formation** : CAP cuisine à Bac+2/3.
- **Compétences techniques** : techniques culinaires, gestion de brigade, hygiène.
- **Soft skills** : créativité, gestion du stress, leadership.
- **Perspectives** : bonnes, mais métier exigeant.

### Serveur(euse) / Barman/barmaid
- **Description** : Accueille et sert les clients dans un restaurant ou un bar.
- **Salaire** : 45 000 à 200 000 FCFA/mois selon le lieu, l’expérience et les pourboires.
- **Formation** : CAP ou expérience.
- **Compétences techniques** : service à table, connaissance des boissons et des mets.
- **Soft skills** : sens du contact, réactivité, sourire commercial.
- **Perspectives** : forte demande, mais turn-over important.

### Réceptionniste / Directeur(trice) d’hôtel
- **Description** : Accueille les clients ou gère l’ensemble d’un établissement hôtelier.
- **Salaire** : 120 000 à 500 000+ FCFA/mois selon le poste.
- **Formation** : Bac+2 à Bac+5.
- **Compétences techniques** : gestion hôtelière, logiciels de réservation, langues étrangères.
- **Soft skills** : sens du service, organisation, diplomatie.
- **Perspectives** : bonnes, tourisme en reprise.

### Guide touristique / Agent(e) de voyage
- **Description** : Accompagne les touristes ou organise des voyages.
- **Salaire** : 100 000 à 300 000 FCFA/mois.
- **Formation** : Bac+2 à Bac+3.
- **Compétences techniques** : connaissance géographique et culturelle, langues, outils de réservation.
- **Soft skills** : pédagogie, sens du relationnel, adaptabilité.
- **Perspectives** : correctes, concurrence des plateformes en ligne.

## 12. SPORT ET BIEN-ÊTRE

### Entraîneur(euse) sportif / Coach personnel
- **Description** : Encadre des sportifs ou des particuliers pour atteindre des objectifs physiques.
- **Salaire** : 100 000 à 400 000+ FCFA/mois, souvent variable et parfois indépendant.
- **Formation** : BPJEPS, STAPS.
- **Compétences techniques** : physiologie de l’exercice, programmation d’entraînement.
- **Soft skills** : motivation, pédagogie, écoute.
- **Perspectives** : bonnes, marché du bien-être en croissance.

### Athlète professionnel(le)
- **Description** : Pratique un sport à haut niveau en compétition.
- **Salaire** : très variable, de quasi nul à plusieurs millions selon la discipline.
- **Formation** : entraînement intensif dès le plus jeune âge.
- **Compétences techniques** : maîtrise technique du sport, préparation physique et mentale.
- **Soft skills** : discipline, résilience, gestion de la pression.
- **Perspectives** : très sélectif, carrière courte.

### Professeur(e) de yoga / Pilates
- **Description** : Enseigne des pratiques corporelles et de bien-être.
- **Salaire** : 100 000 à 300 000 FCFA/mois (souvent indépendant)
- **Formation** : certification spécifique (200h+ pour le yoga)
- **Compétences techniques** : anatomie, techniques de respiration et postures
- **Soft skills** : calme, pédagogie, écoute du corps
- **Perspectives** : en croissance, marché du bien-être dynamique

## 13. SECTEURS PUBLICS ET SERVICES

### Fonctionnaire territorial(e) / Agent(e) administratif(ve)
- **Description** : Travaille pour une administration publique (mairie, État, etc.).
- **Salaire** : 100 000 à 300 000 FCFA/mois
- **Formation** : variable (concours selon catégorie A/B/C)
- **Compétences techniques** : gestion administrative, droit public de base
- **Soft skills** : rigueur, sens du service public, organisation
- **Perspectives** : stables, sécurité de l'emploi

### Diplomate
- **Description** : Représente son pays à l'étranger, négocie des accords internationaux.
- **Salaire** : 500 000 à 1 500 000+ FCFA/mois
- **Formation** : Bac+5 (Sciences Po, concours)
- **Compétences techniques** : relations internationales, langues, négociation
- **Soft skills** : diplomatie, adaptabilité culturelle, discrétion
- **Perspectives** : postes très sélectifs

### Urbaniste
- **Description** : Planifie l'aménagement des villes et territoires.
- **Salaire** : 300 000 à 800 000 FCFA/mois
- **Formation** : Bac+5
- **Compétences techniques** : SIG, droit de l'urbanisme, conception territoriale
- **Soft skills** : vision long-terme, concertation, créativité
- **Perspectives** : bonnes (enjeux climatiques et urbains croissants)

### Travailleur(euse) humanitaire
- **Description** : Intervient dans des contextes de crise pour aider les populations.
- **Salaire** : 200 000 à 800 000 FCFA/mois (souvent ONG)
- **Formation** : variable selon le poste (logistique, médical, coordination)
- **Compétences techniques** : gestion de projet humanitaire, langues, sécurité terrain
- **Soft skills** : résilience, adaptabilité, engagement
- **Perspectives** : variables selon le financement des ONG
`;

const lines = markdown.split('\n');
const careers = [];
let currentSecteur = '';
let currentCareer = null;
let currentId = 1;

for (let line of lines) {
  if (line.startsWith('## ')) {
    currentSecteur = line.replace('## ', '').replace(/^\d+\.\s*/, '').trim();
  } else if (line.startsWith('### ')) {
    if (currentCareer) {
      careers.push(currentCareer);
    }
    const nomMetier = line.replace('### ', '').trim();
    currentCareer = {
      id: 'car_new_' + currentId.toString().padStart(3, '0'),
      nom_metier: nomMetier,
      secteur: currentSecteur,
      description: '',
      salaire: '',
      formation: '',
      competences_techniques: [],
      soft_skills: [],
      perspectives: '',
      match_interets: [],
      match_matieres: [],
      match_competences: [],
      match_environnement: []
    };
    currentId++;
  } else if (line.startsWith('- **Description** : ')) {
    currentCareer.description = line.replace('- **Description** : ', '').trim();
  } else if (line.startsWith('- **Salaire** : ')) {
    currentCareer.salaire = line.replace('- **Salaire** : ', '').trim();
  } else if (line.startsWith('- **Formation** : ')) {
    currentCareer.formation = line.replace('- **Formation** : ', '').trim();
  } else if (line.startsWith('- **Compétences techniques** : ')) {
    const raw = line.replace('- **Compétences techniques** : ', '').trim();
    currentCareer.competences_techniques = raw.split(',').map(s => s.trim());
  } else if (line.startsWith('- **Soft skills** : ')) {
    const raw = line.replace('- **Soft skills** : ', '').trim();
    currentCareer.soft_skills = raw.split(',').map(s => s.trim());
  } else if (line.startsWith('- **Perspectives** : ')) {
    currentCareer.perspectives = line.replace('- **Perspectives** : ', '').trim();
  }
}
if (currentCareer) {
  careers.push(currentCareer);
}

// Generate match fields heuristically
careers.forEach(c => {
  const text = (c.nom_metier + ' ' + c.description + ' ' + c.competences_techniques.join(' ') + ' ' + c.soft_skills.join(' ')).toLowerCase();
  
  if (c.secteur.includes('SANTÉ') || c.secteur.includes('SOCIAL')) {
    c.match_interets.push('Sciences & Recherche', 'Psychologie');
    c.match_matieres.push('SVT', 'Chimie');
    c.match_competences.push('Empathie', 'Communication');
    c.match_environnement.push('En équipe', 'Cadre structuré');
  }
  
  if (c.secteur.includes('INFORMATIQUE') || c.secteur.includes('TECHNOLOGIE')) {
    c.match_interets.push('Technologie & Informatique', 'Programmation', 'Innovation technologique', 'Résolution de problèmes');
    c.match_matieres.push('Informatique', 'Mathématiques');
    c.match_competences.push('Résolution de problèmes', 'Analyse de données', 'Adaptabilité');
    c.match_environnement.push('En bureau', 'En télétravail', 'En autonomie');
  }
  
  if (c.secteur.includes('SCIENCES')) {
    c.match_interets.push('Sciences & Recherche', 'Veille scientifique et technologique');
    c.match_matieres.push('Physique', 'Mathématiques', 'Chimie');
    c.match_competences.push('Analyse de données', 'Résolution de problèmes');
    c.match_environnement.push('En équipe', 'En bureau');
  }

  if (c.secteur.includes('BUSINESS') || c.secteur.includes('FINANCE') || c.secteur.includes('DROIT')) {
    c.match_interets.push('Entrepreneuriat', 'Résolution de problèmes');
    c.match_matieres.push('Économie', 'Mathématiques');
    c.match_competences.push('Leadership', 'Organisation', 'Négociation');
    c.match_environnement.push('En bureau', 'Environnement dynamique/rapide');
  }

  if (c.secteur.includes('ÉDUCATION')) {
    c.match_interets.push('Lecture', 'Psychologie', 'Communication & Médias');
    c.match_matieres.push('Littérature', 'Histoire');
    c.match_competences.push('Communication', 'Empathie', 'Organisation');
    c.match_environnement.push('En équipe', 'Cadre structuré');
  }

  if (c.secteur.includes('ARTS') || c.secteur.includes('MÉDIAS')) {
    c.match_interets.push('Photographie', 'Musique', 'Création de contenu', 'Montage vidéo');
    c.match_matieres.push('Littérature', 'Langues');
    c.match_competences.push('Créativité', 'Communication');
    c.match_environnement.push('En autonomie', 'Horaires flexibles', 'En télétravail');
  }
  
  if (c.secteur.includes('SPORT')) {
    c.match_interets.push('Sport & Fitness');
    c.match_matieres.push('SVT');
    c.match_competences.push('Organisation', 'Communication');
    c.match_environnement.push('En plein air', 'Horaires flexibles');
  }
});

// Read existing careers to merge them.
const path = require('path');
const careersPath = process.env.CAREERS_JSON_PATH || path.join(__dirname, 'careers.json');
const existingData = JSON.parse(fs.readFileSync(careersPath, 'utf8'));

// Format the existing careers as well so the new matcher works.
existingData.careers.forEach(c => {
    if (!c.match_interets) c.match_interets = c.keywords || [];
    if (!c.match_matieres) c.match_matieres = [];
    if (!c.match_competences) c.match_competences = [];
    if (!c.match_environnement) c.match_environnement = [];
    if (!c.soft_skills) c.soft_skills = [];
    if (!c.competences_techniques) c.competences_techniques = c.competences || [];
    if (!c.salaire) c.salaire = c.salaire_debutant ? (c.salaire_debutant + " - " + c.salaire_senior) : "";
    if (!c.formation) c.formation = (c.formations_requises || []).join(", ");
    if (!c.perspectives) c.perspectives = c.demande_marche || "";
});

const finalCareers = existingData.careers.concat(careers);

fs.writeFileSync('d:/Hack_end_year/CAREER_GUIDANCE/app/src/data/careers.json', JSON.stringify({ careers: finalCareers }, null, 2));
console.log('Successfully updated careers.json with ' + careers.length + ' new careers.');
