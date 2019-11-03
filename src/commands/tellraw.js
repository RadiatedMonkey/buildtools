module.exports = function(sender, str) {
    return `tellraw \"${sender}\" {"rawtext":[{"text":"[WorldEdit] ${str}"}]}`;
};