const assert = require('chai').assert;
const df = require('../src/df');

const date = new Date('2020-6-6 11:10:09')

describe('df基础测试', function () {
    it('格式化 YMD',function (){
        assert.equal(df('YMD',date),'20200606')
    })

    it('格式化 Y-M-D h:m:s',function (){
        assert.equal(df('Y-M-D h:m:s',date),'2020-06-06 11:10:09')
    })

    it('格式化 YMD000000',function (){
        assert.equal(df('YMD000000',date),'20200606000000')
    })

    it('柯里化测试',function (){
        assert.equal(df('YMD000000')(date),'20200606000000')
    })
})
