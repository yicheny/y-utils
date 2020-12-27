const assert = require('chai').assert;
const MergeColumns = require('../src/class/MergeColumns');

function createSource() {
    return [
        {header: 'h1', bind: 'b1', width:100},
        {header: 'h2', bind: 'b2'},
        {header: 'h3', bind: 'b3'},
    ]
}

const source = createSource();

describe('mergeColumns基础测试', function () {
    it('选取 pick', function () {
        assert.deepEqual(
            MergeColumns.create('header', source).pick(['h2', 'h3']).data,
            [{header: 'h2', bind: 'b2'}, {header: 'h3', bind: 'b3'}]
        );

        assert.deepEqual(
            MergeColumns.create('bind', source).pick(['b1']).data,
            [{header: 'h1', bind: 'b1', width:100}]
        );
    });

    it('省略 omit', function () {
        assert.deepEqual(
            MergeColumns.create('header', source).omit(['h1']).data,
            [{header: 'h2', bind: 'b2'}, {header: 'h3', bind: 'b3'}]
        );

        assert.deepEqual(
            MergeColumns.create('bind', source).omit(['b2','b3']).data,
            [{header: 'h1', bind: 'b1', width:100}]
        );
    });

    it('插入 insert', function () {
        assert.deepEqual(
            MergeColumns.create('header',source).insert([{_beforeKey:'h1',header:'h0',bind:'b0'}]).data,
            [ { header: 'h0', bind: 'b0' },
                { header: 'h1', bind: 'b1', width:100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' } ]
        );

        assert.deepEqual(
            MergeColumns.create('header',source).insert([{_beforeKey:'h3',header:'h2.5',bind:'b2.5'}]).data,
            [ { header: 'h1', bind: 'b1', width:100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h2.5',bind:'b2.5'},
                { header: 'h3', bind: 'b3' } ]
        );

        assert.deepEqual(
            MergeColumns.create('header',source).insert([{_afterKey:'h3',header:'h4',bind:'b4'}]).data,
            [ { header: 'h1', bind: 'b1', width:100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' },
                { header: 'h4', bind: 'b4' } ]
        );
    });

    it('更新 update',function(){
        assert.deepEqual(
            MergeColumns.create('header',source).update([{_key:'h1',width:300}]).data,
            [ { header: 'h1', bind: 'b1', width: 300 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' } ]
        )

        assert.deepEqual(
            MergeColumns.create('header',source).update([{_key:'h1',width:undefined}]).data,
            [ { header: 'h1', bind: 'b1', width: undefined },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' } ]
        )

        assert.deepEqual(
            MergeColumns.create('header',source).update([{_key:'h3',width:88}]).data,
            [ { header: 'h1', bind: 'b1', width: 100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3', width: 88 } ]
        )
    })
})

describe('mergeColumns组合测试',function(){
    it('选取并插入 pick+insert',function (){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .pick(['h2', 'h3'])
                .insert([
                    {_beforeKey:'h2',header:'h0',bind:'h0'},
                    {_afterKey:'h3',header:'h4',bind:'h4'}
                ])
                .data,
            [{header:'h0',bind:'h0'},
                {header: 'h2', bind: 'b2'},
                {header: 'h3', bind: 'b3'},
                {header:'h4',bind:'h4'}]
        );
    });

    it('省略并插入 omit+insert',function(){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .omit(['h1','h3'])
                .insert([
                    {_beforeKey:'h2',header:'h0',bind:'h0'},
                    {_afterKey:'h2',header:'h4',bind:'h4'}
                ])
                .data,
            [{header:'h0',bind:'h0'},
                {header: 'h2', bind: 'b2'},
                {header:'h4',bind:'h4'}]
        );
    });

    it('选取并更新 pick+update',function(){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .pick(['h2', 'h3'])
                .update([
                    {_key:'h2',header:'h2-update',width:88},
                ])
                .data,
            [{header:'h2-update',bind:'b2',width:88},
                {header: 'h3', bind: 'b3'}]
        );
    });

    it('省略并更新 omit+update',function(){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .omit(['h2'])
                .update([
                    {_key:'h1',header:'h1-update',width:123},
                ])
                .data,
            [{header: 'h1-update', bind: 'b1', width:123},
                {header: 'h3', bind: 'b3'},]
        );
    });

    it('插入并更新 insert+update',function(){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .insert([
                    {_beforeKey:'h1',header:'h0',bind:'h0'},
                    {_afterKey:'h3',header:'h4',bind:'h4'}
                ])
                .update([
                    {_key:'h0', width:88, bind:'h0-update'},
                    {_key:'h1', width:123},
                    {_key:'h2', bind:'h2-update'},
                ])
                .data,
            [{header:'h0', width:88, bind:'h0-update'},
                {header: 'h1', bind: 'b1', width:123},
                {header: 'h2', bind:'h2-update'},
                {header: 'h3', bind: 'b3'},
                {header:'h4',bind:'h4'}]
        );
    });

    it('挑选、插入并更新 pick+insert+update',function(){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .pick(['h1','h3'])
                .insert([
                    {_beforeKey:'h1',header:'h0',bind:'h0'},
                    {_afterKey:'h3',header:'h4',bind:'h4'}
                ])
                .update([
                    {_key:'h0', width:88, bind:'h0-update'},
                    {_key:'h1', width:123},
                    {_key:'h4', bind:'h4-update'},
                ])
                .data,
            [{header:'h0', width:88, bind:'h0-update'},
                {header: 'h1', bind: 'b1', width:123},
                {header: 'h3', bind: 'b3'},
                {header:'h4',bind:'h4-update'}]
        );


    });

    it('省略、插入并更新 omit+insert+update',function(){
        assert.deepEqual(
            MergeColumns.create('header', source)
                .omit(['h2'])
                .insert([
                    {_beforeKey:'h1',header:'h0',bind:'h0'},
                    {_afterKey:'h3',header:'h4',bind:'h4'}
                ])
                .update([
                    {_key:'h0', width:88, bind:'h0-update'},
                    {_key:'h1', width:123},
                    {_key:'h4', bind:'h4-update'},
                ])
                .data,
            [{header:'h0', width:88, bind:'h0-update'},
                {header: 'h1', bind: 'b1', width:123},
                {header: 'h3', bind: 'b3'},
                {header:'h4',bind:'h4-update'}]
        );
    });
})
