
// USAGE:
// Open Chrome and navigate to the settings page where the search engine entries are displayed (e.g., chrome://settings/searchEngines).
// Right-click on the page and select "Inspect" to open Developer Tools.
// Go to the "Console" tab in the Developer Tools.
// Copy and paste this script into the console and press Enter.

// Function to simulate a click event
function simulateClick(element) {
    element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    }));
}

// Function to delete all search engine entries except @bookmarks and @history
async function deleteAllSearchEngineEntries() {
    let settingsUi = document.querySelector("body > settings-ui");

    if (settingsUi) {
        let main = settingsUi.shadowRoot.querySelector("#main");
        if (main) {
            let basicPage = main.shadowRoot.querySelector("settings-basic-page");
            if (basicPage) {
                let searchPage = basicPage.shadowRoot.querySelector("#basicPage > settings-section.expanded > settings-search-page");
                if (searchPage) {
                    let enginesPage = searchPage.shadowRoot.querySelector("#pages > settings-subpage > settings-search-engines-page");
                    if (enginesPage) {
                        let activeEngines = enginesPage.shadowRoot.querySelector("#activeEngines");
                        if (activeEngines) {
                            let entries = activeEngines.shadowRoot.querySelectorAll("settings-search-engine-entry");

                            for (let entry of entries) {
                                try {
                                    // Check for non-deletable entries like @bookmarks and @history
                                    let shortcutText = entry.shadowRoot.querySelector('.keyword-column').textContent.trim();
                                    if (shortcutText === '@bookmarks' || shortcutText === '@history') {
                                        continue; // Skip this entry
                                    }

                                    // Open the dropdown menu
                                    let moreButton = entry.shadowRoot.querySelector('cr-icon-button.icon-more-vert');
                                    if (moreButton) {
                                        simulateClick(moreButton);
                                        await new Promise(r => setTimeout(r, 500)); // Wait for menu to open

                                        // Click the delete button
                                        let deleteButton = entry.shadowRoot.querySelector('button#delete');
                                        if (deleteButton) {
                                            simulateClick(deleteButton);
                                            await new Promise(r => setTimeout(r, 500)); // Wait for deletion action to complete
                                        }
                                    }
                                } catch (error) {
                                    console.error('Error processing an entry:', error);
                                    // Continue to the next entry
                                }
                            }

                            console.log('Deletion process completed.');
                        }
                    }
                }
            }
        }
    }
}

// Run the function
deleteAllSearchEngineEntries();
