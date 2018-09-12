class Supply {
    constructor(type, size, keepCount) {
        if (type === undefined)
            throw 'Supply needs a type';
        this._ = {}
        this._.type = type;
        this._.size = size;
        this._.keepCount = !!keepCount;
    }

}