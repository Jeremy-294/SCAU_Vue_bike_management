// ������Ŀ�����׶���Ҫ�õ���babel���
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}


module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //������Ʒʱ��Ĳ������
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}
