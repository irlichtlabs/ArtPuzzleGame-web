'use strict';

/**
 * Deals paintings in a shuffled order without repeats until the whole collection has been
 * shown, then reshuffles. Keeps nothing between launches: there is no scoring.
 * The second answer option always comes from a different period than the right one.
 */
function Game(paintings, random) {
  this.paintings = paintings;
  this.random = random || Math.random;
  this.deck = [];
  this.last = null;
  this.artists = [];
  for (var i = 0; i < paintings.length; i++) {
    if (this.artists.indexOf(paintings[i].artist) < 0) this.artists.push(paintings[i].artist);
  }
}

Game.prototype.pick = function (list) {
  return list[Math.floor(this.random() * list.length)];
};

Game.prototype.nextRound = function () {
  if (this.deck.length === 0) this.deck = this.shuffledAvoidingRepeats();
  var painting = this.deck.shift();
  this.last = painting;

  var decoys = this.artists.filter(function (a) { return a.period !== painting.artist.period; });
  var decoy = this.pick(decoys);
  var options = this.random() < 0.5 ? [painting.artist, decoy] : [decoy, painting.artist];
  return { painting: painting, options: options };
};

/** A painting by `artist` to show alongside when that artist was chosen instead. */
Game.prototype.exampleBy = function (artist) {
  return this.pick(this.paintings.filter(function (p) { return p.artist === artist; }));
};

/** Shuffle so the same artist never comes twice in a row (also across reshuffles). */
Game.prototype.shuffledAvoidingRepeats = function () {
  var groups = this.artists.map(function (artist) {
    return { artist: artist, paintings: this.paintings.filter(function (p) { return p.artist === artist; }) };
  }, this);
  var previous = this.last && this.last.artist;
  var order = [];
  while (order.length < this.paintings.length) {
    var available = groups.filter(function (g) { return g.artist !== previous && g.paintings.length; });
    if (!available.length) throw new Error('Collection cannot avoid consecutive artists');
    // Use the largest remaining group first, breaking ties randomly. This cannot
    // strand a repeated artist at the end of our balanced 12 × 5 collection.
    var largest = Math.max.apply(null, available.map(function (g) { return g.paintings.length; }));
    var group = this.pick(available.filter(function (g) { return g.paintings.length === largest; }));
    var index = Math.floor(this.random() * group.paintings.length);
    order.push(group.paintings.splice(index, 1)[0]);
    previous = group.artist;
  }
  return order;
};

Game.prototype.noArtistTwiceInARow = function (order) {
  if (this.last && order[0].artist === this.last.artist) return false;
  for (var i = 1; i < order.length; i++) {
    if (order[i].artist === order[i - 1].artist) return false;
  }
  return true;
};
