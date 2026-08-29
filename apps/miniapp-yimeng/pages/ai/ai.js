const mockAnswer = {
  answer: '沂蒙精神是在长期革命、建设和发展实践中形成的宝贵精神财富。第一版演示以“知识内容 + 来源证据 + 相关内容”的方式组织答案；接入真实 Intelligence API 后，将由知识检索和模型服务生成。',
  sources: [
    { id: 'source-001', type: '专题', title: '沂蒙精神专题资料' },
    { id: 'source-002', type: '人物', title: '沂蒙红嫂代表人物' }
  ],
  evidence: [
    { id: 'evidence-001', label: '知识库', title: '沂蒙精神历史与文化资料' }
  ],
  related: [
    { id: 'story-001', type: 'story', title: '沂蒙红嫂的故事' },
    { id: 'person-001', type: 'person', title: '沂蒙红嫂代表人物' }
  ]
};

Page({
  data: { input: '', sending: false, messages: [], suggestedQuestions: ['沂蒙精神是在怎样的历史背景下形成的？','沂蒙有哪些代表人物和经典故事？','怎样理解沂蒙精神的时代价值？'] },
  onInput(e) { this.setData({ input: e.detail.value }); },
  askSuggested(e) { const input = e.currentTarget.dataset.question; this.setData({ input }); this.ask(); },
  onSubmit() { this.ask(); },
  ask() {
    const text = (this.data.input || '').trim();
    if (!text || this.data.sending) return;
    this.setData({ input: '', sending: true, messages: [...this.data.messages, { role: 'user', text }] });
    setTimeout(() => this.setData({ sending: false, messages: [...this.data.messages, { role: 'assistant', ...mockAnswer }] }), 450);
  },
  copyAnswer(e) { wx.setClipboardData({ data: e.currentTarget.dataset.text || '' }); },
  openRelated(e) { wx.navigateTo({ url: `/pages/detail/detail?type=${e.currentTarget.dataset.type}&id=${e.currentTarget.dataset.id}` }); },
  onShareAppMessage() { return { title: '沂蒙精神智能助手', path: '/pages/ai/ai' }; }
});
