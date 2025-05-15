# Greek Flashcard Helper

A basic web application to help with learning Greek words by providing quick access to various vocabulary learning resources.

## Features

Search for English words and get embedded results for:

- Greek Wiktionary (for translations)
- Langeek Dictionary (for images)
- Forvo (for pronunciation)

## How to Use

### Search

1. Start the server by running `npm start` (or `npm run dev` for dev mode)
1. Open [http://localhost:3000](http://localhost:3000) in your web browser
1. Enter an English word in the Search field and submit

### Results

#### Wiktionary

Translations are displayed in the **Wiktionary Results** section.

- Copy a translation and add it to your flashcard

#### Langeek

Images are displayed in the **Langeek Results** section

- Copy an image and add it to your flashcard
- If the image displayed is for a different meaning of your search term, click the `↗` link to view images for other meanings of your search term in a new tab

### Forvo

You must select a Greek word in order to find pronunciation audio files.

- Select a Greek word from the **Wiktionary Results** section to get a “Listen on Forvo” button
- Click the button to open the Greek word in Forvo in a new tab
- Download a pronunciation audio file from Forvo (account required)
- Add the audio file to your flashcard

### Quick Links

If any of the embedded search results do not fit your needs, you can use the **Quick Links** section to open your search term in the respective service in a new tab. In the case of Forvo, it will take you to the Forvo home page, where you can search for a Greek word.

## Future Improvements

- Add export functionality for creating flashcards
