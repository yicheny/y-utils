const assert = require('chai').assert;
const mergeColumns = require('../src/class/MergeColumns');

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
            mergeColumns('header', source).pick(['h2', 'h3']).data,
            [{header: 'h2', bind: 'b2'}, {header: 'h3', bind: 'b3'}]
        );

        assert.deepEqual(
            mergeColumns('bind', source).pick(['b1']).data,
            [{header: 'h1', bind: 'b1', width:100}]
        );

        assert.deepEqual(mergeColumns('header',source).pick().data, []);
        assert.deepEqual(mergeColumns('header',source).pick(undefined).data, []);
        assert.deepEqual(mergeColumns('header',source).pick(null).data, []);
        assert.deepEqual(mergeColumns(null,source).pick().data, []);
        assert.deepEqual(mergeColumns(null,source).pick(undefined).data, []);
        assert.deepEqual(mergeColumns(null,source).pick(null).data, []);

        assert.deepEqual(mergeColumns('header',source).pick([]).data, []);

        assert.deepEqual(mergeColumns('header',source).pick(source.map(x=>x['header'])).data, source);
    });

    it('忽略 omit', function () {
        assert.deepEqual(
            mergeColumns('header', source).omit(['h1']).data,
            [{header: 'h2', bind: 'b2'}, {header: 'h3', bind: 'b3'}]
        );

        assert.deepEqual(
            mergeColumns('bind', source).omit(['b2','b3']).data,
            [{header: 'h1', bind: 'b1', width:100}]
        );

        assert.deepEqual(mergeColumns('header',source).omit().data, source);
        assert.deepEqual(mergeColumns('header',source).omit(undefined).data, source);
        assert.deepEqual(mergeColumns('header',source).omit(null).data, source);
        assert.deepEqual(mergeColumns(null,source).omit().data, source);
        assert.deepEqual(mergeColumns(null,source).omit(undefined).data, source);
        assert.deepEqual(mergeColumns(null,source).omit(null).data, source);

        assert.deepEqual(mergeColumns('header',source).omit([]).data, source);

        assert.deepEqual(mergeColumns('header',source).omit(source.map(x=>x['header'])).data, []);
    });

    it('插入 insert', function () {
        assert.deepEqual(
            mergeColumns('header',source).insert([{_beforeKey:'h1',header:'h0',bind:'b0'}]).data,
            [ { header: 'h0', bind: 'b0' },
                { header: 'h1', bind: 'b1', width:100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' } ]
        );

        assert.deepEqual(
            mergeColumns('header',source).insert([{_beforeKey:'h3',header:'h2.5',bind:'b2.5'}]).data,
            [ { header: 'h1', bind: 'b1', width:100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h2.5',bind:'b2.5'},
                { header: 'h3', bind: 'b3' } ]
        );

        assert.deepEqual(
            mergeColumns('header',source).insert([{_afterKey:'h3',header:'h4',bind:'b4'}]).data,
            [ { header: 'h1', bind: 'b1', width:100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' },
                { header: 'h4', bind: 'b4' } ]
        );

        assert.deepEqual(mergeColumns('header',source).insert().data, source);
        assert.deepEqual(mergeColumns('header',source).insert(null).data, source);
        assert.deepEqual(mergeColumns('header',source).insert(undefined).data, source);
        assert.deepEqual(mergeColumns(null,source).insert().data, source);
        assert.deepEqual(mergeColumns(null,source).insert(null).data, source);
        assert.deepEqual(mergeColumns(null,source).insert(undefined).data, source);
        assert.deepEqual(mergeColumns(null,source).insert([]).data, source);
    });

    it('更新 update',function(){
        assert.deepEqual(
            mergeColumns('header',source).update([{_key:'h1',width:300}]).data,
            [ { header: 'h1', bind: 'b1', width: 300 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' } ]
        )

        assert.deepEqual(
            mergeColumns('header',source).update([{_key:'h1',width:undefined}]).data,
            [ { header: 'h1', bind: 'b1', width: undefined },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3' } ]
        )

        assert.deepEqual(
            mergeColumns('header',source).update([{_key:'h3',width:88}]).data,
            [ { header: 'h1', bind: 'b1', width: 100 },
                { header: 'h2', bind: 'b2' },
                { header: 'h3', bind: 'b3', width: 88 } ]
        )

        assert.deepEqual(mergeColumns('header',source).update().data, source);
        assert.deepEqual(mergeColumns('header',source).update(null).data, source);
        assert.deepEqual(mergeColumns('header',source).update(undefined).data, source);
        assert.deepEqual(mergeColumns(null,source).update().data, source);
        assert.deepEqual(mergeColumns(null,source).update(null).data, source);
        assert.deepEqual(mergeColumns(null,source).update(undefined).data, source);
        assert.deepEqual(mergeColumns(null,source).update([]).data, source);
    })
})

describe('mergeColumns组合测试',function(){
    it('选取并插入 pick+insert',function (){
        assert.deepEqual(
            mergeColumns('header', source)
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

    it('忽略并插入 omit+insert',function(){
        assert.deepEqual(
            mergeColumns('header', source)
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
            mergeColumns('header', source)
                .pick(['h2', 'h3'])
                .update([
                    {_key:'h2',header:'h2-update',width:88},
                ])
                .data,
            [{header:'h2-update',bind:'b2',width:88},
                {header: 'h3', bind: 'b3'}]
        );
    });

    it('忽略并更新 omit+update',function(){
        assert.deepEqual(
            mergeColumns('header', source)
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
            mergeColumns('header', source)
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
            mergeColumns('header', source)
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

    it('忽略、插入并更新 omit+insert+update',function(){
        assert.deepEqual(
            mergeColumns('header', source)
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
