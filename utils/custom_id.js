optionNames = new Map([
    ['reqModal', ['reviewOpt']],
    ['rnsBtn', ['levelID', 'mention', 'reviewOpt']],
    ['rndBtn', ['levelID', 'mention', 'reviewOpt']],
    ['dBtn', ['levelID', 'mention']],
    ['sBtn', ['levelID', 'mention']],
    ['rnsModal', ['levelID', 'mention', 'msgID']],
    ['rndModal', ['levelID', 'mention', 'msgID']],
    ['dModal', ['levelID', 'mention', 'msgID']],
    ['robSentBtn', ['levelID', 'mention']],
    ['robDiscardedBtn', ['levelID', 'mention']],
]);

class CustomID
{
    constructor(parts)
    {
        this.slug = parts[0];
        this.options = parts.slice(1);
        
        this.optNames = optionNames.get(this.slug);
    }

    static fromStr(str)
    {
        return new CustomID(str.split('-'));
    }

    static explicit(slug, optionsObj)
    {
        const optNames = optionNames.get(slug);
        const parts = [slug];
        
        for (let [name, value] of Object.entries(optionsObj))
            parts[optNames.indexOf(name) + 1] = value;

        return new CustomID(parts);
    }

    toStr()
    {
        return this.slug + '-' + this.options.join('-');
    }

    getOption(name)
    {
        return this.options[this.optNames.indexOf(name)];
    }
}

module.exports.CustomID = CustomID;