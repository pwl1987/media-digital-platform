const suggestedQuestions = [
  '沂蒙精神是在怎样的历史背景下形成的？',
  '沂蒙有哪些代表人物和经典故事？',
  '为什么说沂蒙精神体现了军民鱼水情？'
];

function mockAnswer(question) {
  return {
    answer: `围绕“${question}”，这里先展示基于平台知识库的示例回答。正式接入后，回答将由 Yimeng Intelligence 通过检索增强生成，并同时返回可追溯的来源与证据。`,
    sources: [
      { id: 'source-001', type: '专题', title: '沂蒙精神历史与时代价值' },
      { id: 'source-002', type: '故事', title: '沂蒙红嫂代表故事' }
    ],
    evidence: [
      { id: 'evidence-001', label: '平台知识条目', title: '沂蒙精神形成与发展' }
    ],
    related: [
      { id: 'person-001', type: '人物', title: '沂蒙红嫂代表人物' },
      { id: 'story-001', type: '故事', title: '沂蒙红嫂的故事' }
    ]
  };
}

Page({
  data: {
    input: '',
    messages: [],
    suggestedQuestions
  },

  onInput(e) {
    this.setData({ input: e.detail.value });
  },

  ask(question) {
    const text = (question || this.data.input || '').trim();
    if (!text) return;
    const answer = mockAnswer(text);
    this.setData({
      input: '',
      messages: this.data.messages.concat([
        { role: 'user', text },
        { role: 'assistant', ...answer }
      ])
    });
  },

  onSubmit(e) {
    this.ask(e.detail.value);
  },

  askSuggested(e) {
    this.ask(e.currentTarget.dataset.question);
  },

  copyAnswer(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.text || '' });
  },

  openRelated(e) {
    const { type, id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?type=${type}&id=${id}` });
  }
});
