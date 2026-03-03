# divreste

Générateur de feuilles de divisions euclidiennes (quotient + reste) à la demande.

## Installation

```bash
cd ~/dev/play/divreste
npm install
```

## Utilisation

```bash
# Générer une feuille .md (défaut)
npm run generate

# Générer md + html + pdf
npm run generate -- --all

# 20 divisions, diviseurs entre 5 et 9
npm run generate -- -n 20 -d 5-9 --all

# Dossier de sortie
npm run generate -- -o ./output --all
```

### Options

| Option | Description |
|--------|-------------|
| `-n, --count N` | Nombre de divisions (défaut: 36) |
| `-d, --divisors A-B` | Diviseurs min-max (défaut: 4-12) |
| `-o, --output DIR` | Dossier de sortie |
| `--md` | Générer .md |
| `--html` | Générer .html |
| `--pdf` | Générer .pdf (nécessite pandoc) |
| `--all` | Générer md + html + pdf |

## PDF

Pour générer des PDF, installez pandoc :

```bash
brew install pandoc
# Optionnel pour LaTeX :
brew install --cask basictex
```

## Format

Chaque ligne : `38 ÷ 6  = ____ reste ____` + tabulations + réponse `6.2` (quotient.reste).  
Pour s'autocorriger, plier la feuille pour cacher la colonne des résultats.
