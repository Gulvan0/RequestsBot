const ytPattern = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*(v|si)=|v\/|\/)([\w\-_]+)\&?$/;

function isValidLink(link)
{
    return link.match(ytPattern) != null;
}

module.exports.isValidLink = isValidLink;