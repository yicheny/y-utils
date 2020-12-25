import _ from 'lodash';
import compose from "./utils/compose";

/*
author: ylf
* */
function mergeColumns(key,source,data){
    if([source,data].some(x=>!_.isArray(x))) return source;
    return compose(delColumns,updateColumns,addNewColumns)(source);

    /*
    * TODO 插入顺序，尚未实现，有需求的时候再再加上这个功能
    * __before 插入某位置前
    * __after 插入某位置后
    * */
    function addNewColumns(source){
        const sourceKeys = _.map(source,x=>x[key]);
        return _.reduce(data,(acc,x)=>{
            if(!sourceKeys.includes(x[key])) acc.push(x);
            return acc;
        },_.cloneDeep(source));
    }

    function updateColumns(source){
        const dataKeys = _.map(data,x=>x[key]);
        return _.map(source,(x)=>{
            if(dataKeys.includes(x[key])) return _.assign(x,findDataItem(x[key]));
            return x;
        })
    }

    function delColumns(source){
        const delKeys = _.filter(data,x=>x.__delete === true).map(x=>x[key]);
        _.forEach(source,x=>{
            if(delKeys.includes(x[key])) source.pull(x);
        });
        return source;
    }

    function findDataItem(value){
        return _.find(data,x=>x[key]===value);
    }
}

export const mergeColumnsWithHeader = _.curry(mergeColumns)('header');
