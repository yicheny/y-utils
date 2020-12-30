const _ = require('lodash');
// const compose = require('../utils/compose');

/*
author: ylf
* */
class MergeColumns{
    constructor(key,source) {
        this._key = key;
        this._data = _.isArray(source) ? _.cloneDeep(source) : [];
    }

    static create(...params){
        return new MergeColumns(...params);
    }

    pick(keys){
        // this._data = _.filter(this._data,x=>_.includes(keys,x[this._key]));
        this._data = _.reduce(keys,(acc,key)=>{
            const item = _.find(this._data,x=>x[this._key] === key);
            item && acc.push(item);
            return acc;
        },[])
        return this;
    }

    omit(values){
        this._data = _.filter(this._data,x=>!_.includes(values,x[this._key]));
        return this;
    }

    _insertKey(key,indexOffset,x){
        if(!_.isNil(x[key])) {
            const item = _.find(this._data,o=>o[this._key] === x[key]);
            if(!item) return null
            const insertIndex = _.indexOf(this._data,item) + indexOffset;
            return this._data.splice(insertIndex,0,_.omit(x,[key]));
        }
    }

    insert(data){
        _.forEach(data,x=>{
            this._insertKey('_beforeKey',0,x);
            this._insertKey('_afterKey',1,x);
        });
        return this;
    }

    update(data){
        const keys = _.map(data,x=>x._key);
        _.forEach(this._data,(x,i,ary)=>{
            if(!_.includes(keys,x[this._key])) return null;
            const item = _.find(data,o=>(o._key === x[this._key]));
            ary[i] = _.assign(x,_.omit(item,['_key']))
        })
        return this;
    }

    head(data){
        if(_.isPlainObject(data)) this._data.unshift(data);
        if(_.isArray(data)) this._data = _.concat(data,this._data);
        return this;
    }

    tail(data){
        if(_.isPlainObject(data)) this._data.push(data);
        if(_.isArray(data)) this._data = _.concat(this._data,data);
        return this;
    }

    get data(){
        return this._data;
    }
}

const mergeColumns = MergeColumns.create;
module.exports = mergeColumns;

//
test();

function test(){
    const source = [
        {header:'h1',bind:'b1',width:100},
        {header:'h2',bind:'b2'},
        {header:'h3',bind:'b3'},
    ];

    // console.log(MergeColumns.create('header',source).pick(['h2','h3']).data);
    console.log(MergeColumns.create('header',source).pick(['h3','h1']).data);
    // console.log(MergeColumns.create('header',source).omit(['h1']).data);

    // console.log(MergeColumns.create('header',source).insert([{_beforeKey:'h1',header:'h0',bind:'b0'}]).data);
    // console.log(MergeColumns.create('header',source).insert([{_afterKey:'h3',header:'h4',bind:'b4'}]).data);

    // console.log(MergeColumns.create('header',source).update([{_key:'h1',width:300}]).data);
    // console.log(MergeColumns.create('header',source).update([{_key:'h1',width:undefined}]).data);
    // console.log(MergeColumns.create('header',source).update([{_key:'h3',width:88}]).data);

    // console.log(
    //     MergeColumns.create('header', source)
    //         .pick(['h1','h3'])
    //         .insert([
    //             {_beforeKey:'h1',header:'h0',bind:'h0'},
    //             {_afterKey:'h3',header:'h4',bind:'h4'}
    //         ])
    //         .update([
    //             {_key:'h0', width:88, bind:'h0-update'},
    //             {_key:'h1', width:123},
    //             {_key:'h4', bind:'h4-update'},
    //         ])
    //         .data,
    // )
}
