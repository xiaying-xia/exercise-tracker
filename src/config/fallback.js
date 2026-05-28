/** 无法加载 public/config 时使用（与 default 文件夹内容一致） */
export const FALLBACK_CONFIG = {
  set: 'default',
  app: {
    name: '运动打卡',
    shortName: '运动打卡',
    description: '记录每日运动与身体数据，本地保存',
  },
  templateCategories: [
    { id: 'cardio', label: '有氧' },
    { id: 'strength', label: '力量' },
    { id: 'flex', label: '柔韧' },
    { id: 'ball', label: '球类' },
    { id: 'outdoor', label: '户外' },
    { id: 'other', label: '其他' },
  ],
  templates: [
    { name: '跑步', category: 'cardio', minutes: 30 },
    { name: '游泳', category: 'cardio', minutes: 45 },
    { name: '力量训练', category: 'strength', minutes: 45 },
  ],
  bodyFields: [
    { key: 'weight', label: '体重', unit: 'kg', step: 0.1, placeholder: '如 65.5' },
    { key: 'bust', label: '胸围', unit: 'cm', step: 0.5, placeholder: '如 90' },
    { key: 'waist', label: '腰围', unit: 'cm', step: 0.5, placeholder: '如 72' },
    { key: 'hip', label: '臀围', unit: 'cm', step: 0.5, placeholder: '如 95' },
  ],
}
