document.getElementById("input-search").addEventListener("keypress", event => {
    if (event.keyCode === 13) {
        preformSearchAndShowCards
                (document.getElementById("input-amount").value)
                (document.getElementById("input-search").value);
    }
});

document.getElementById("input-amount").addEventListener("keypress", event => {
    if (event.keyCode === 13) {
        preformSearchAndShowCards
                (document.getElementById("input-amount").value)
                (document.getElementById("input-search").value);
    }
});

document.getElementById("btn-submit").addEventListener("click", () => {
    preformSearchAndShowCards
            (document.getElementById("input-amount").value)
            (document.getElementById("input-search").value);
});

function getItunesResponse(search, amount) {
    return $.ajax(
        `http://itunes.apple.com/search?term=${search}&entity=album,song` +
                `&limit=${amount}`,

        {
            dataType: 'JSONP'
        }
    );
}

function cardsForData(data) {
    return new Promise((resolve, reject) => {
        if (data.results.length === 0) {
            reject(new Error("That search produced no results."));
        }

        resolve(data.results.reduce((cards, result, i) => {
            return cards + `
                <div class="col-12 col-sm-6 col-md-4 my-4">
                    <div class="card">
                        ${(
                            result.wrapperType === "track"
                                    || result.wrapperType === "collection" ? `
                                        <img class="card-img-top"
                                                src="${result.artworkUrl100
                                                .split("100x100bb.jpg")
                                                .join("1000x1000bb.jpg")}"
                                                alt="artwork" />
                                    ` : ""
                        )}
                        <div class="card-body">
                            <h4 class="card-title">
                                ${
                                    result.wrapperType === "track"
                                            ? result.trackName
                                    : result.wrapperType === "collection"
                                            ? result.collectionName
                                    : result.wrapperType === "artist"
                                            ? result.artistName : "Unknown"
                                }
                                <small class="text-muted">
                                    ${
                                        result.wrapperType === "track"
                                                ? "Track"
                                        : result.wrapperType === "collection"
                                                ? "Collection" : "Unknown"
                                    }
                                </small>
                            </h4>
                            ${(
                                result.wrapperType !== "artist" ? `
                                    <p>
                                        by ${result.artistName}
                                    </p>
                                ` : ""
                            )}
                            ${(
                                result.wrapperType == "track" ? `
                                    <audio src="${result.previewUrl}" controls
                                            class="d-block my-3 w-100"></audio>
                                ` : ""
                            )}
                            <a href="${result.collectionViewUrl}"
                                    class="btn btn-primary">
                                See it on iTunes
                            </a>
                        </div>
                    </div class="card">
                </div>
            `;
        }, ""));
    });
}

function preformSearchAndShowCards(amount) {
    return function(search) {
        getItunesResponse(search, amount).then(data => {
            return cardsForData(data);
        }).then(cards => {
            document.getElementById("row-cards").innerHTML = cards;
        }).catch(error => {
            document.getElementById("row-cards").innerHTML
                    = (error.message ?
                            error.message
                    : error.status ?
                            error.status + " Error!" : "An error occurred.")
                    + " Please try again later.";
        });
    }
}
