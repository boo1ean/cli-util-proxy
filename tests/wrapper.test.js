const { execSync } = require('child_process')

test('Basic wrapper', async () => {
    const result1 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js sample1`)
    expect(result1.toString()).toContain('sample1 transformed')

    const result2 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js sample2 custom-value`)
    expect(result2.toString()).toContain('sample2 transformed')

    const result3 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js first second optional-val`)
    expect(result3.toString()).toContain('sample3 transformed')

    const result4 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js with-opt --verbose`)
    expect(result4.toString()).toContain('with-opt')

    const result5 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js set --key value`)
    expect(result5.toString()).toContain('set --key value')

    const result6 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js asdfqwer`)
    expect(result6.toString()).toContain('asdfqwer')

    const result7 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js many-opts -v -q -f file --name name-value`)
    expect(result7.toString()).toContain('yes there are many opts -v -q -f file --name name-value')

    const result8 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js opts-override  --verbose -f no --name nono`)
    expect(result8.toString()).toContain('opts override -f yes --name sure --verbose')

    const result9 = execSync(`DEBUG=cli-util-proxy ${__dirname}/wrapped-echo.js c1 c4`)
    expect(result9.toString()).toContain('c1 c4')

});