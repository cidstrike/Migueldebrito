# Miguel de Brito — portfolio

Portfolio statique hébergé gratuitement avec GitHub Pages (branche `main`, dossier racine).

## Structure
- `index.html` — contenu et sections (films, à propos, contact)
- `style.css` — design responsive
- `script.js` — galerie, filtres et lecteur vidéo intégré
- `videos.js` — **la liste des vidéos** (YouTube / Vimeo)
- `img/` — logo, portrait, miniatures Vimeo, image de partage

## Ajouter, retirer ou corriger une vidéo
Tout se passe dans `videos.js`. Une entrée :

    { "id": "uQ2b_QZcBaM", "p": "youtube", "cat": "film", "title": "Je truc" }

- `id` : l'identifiant YouTube (après `v=`) ou Vimeo (le nombre dans l'URL)
- `p` : `"youtube"` ou `"vimeo"`
- `cat` : `film`, `cam` (chef-opérateur), `clip` (clips officiels), `clipx` (clips non-officiels), `teaser`
- `title` : le titre affiché. Avec `null`, le site essaie de le récupérer en ligne
- Pour retirer une vidéo : supprimer son bloc `{ ... }`
- Miniature Vimeo : ajouter `img/vimeo/<id>.jpg` (les miniatures YouTube sont automatiques)
