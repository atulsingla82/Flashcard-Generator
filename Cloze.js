var Cloze = function(text, cloze) {

    this.text = text;
    this.cloze = cloze;
    this.printCloze = function() {
        console.log(this.cloze);
    }
    this.printText = function() {
        console.log(this.text);
    }

    this.message = this.text.replace('(' + this.cloze + ')', '________');

}

Cloze.prototype.printAnswer = function() {

    console.log('Incorrect. Here is the full sentence: \n' + this.text.replace(/[{()}]/g, ''));
}

module.exports = Cloze;