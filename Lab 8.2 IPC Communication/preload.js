const { contextBridge, ipcRenderer } = require('electron');

console.log('🌉 [PRELOAD] กำลังตั้งค่า security bridge...');

// ✅ เปิดเผย APIs ที่ปลอดภัยให้ Renderer ใช้
contextBridge.exposeInMainWorld('electronAPI', {
  // 📤 ส่งข้อความไป Main Process
  sendMessage: (message) => {
    console.log('📤 [PRELOAD] ส่งข้อความ:', message);
    return ipcRenderer.invoke('send-message', message);
  },

  login: (agentId, password) => {
    console.log(`🔐 [PRELOAD] ร้องขอ Login Agent ID: ${agentId}`);
    return ipcRenderer.invoke('agent-login', { agentId, password });
  },
  
  onAgentStatusChange: (callback) => ipcRenderer.on('agent-status-changed', (event, ...args) => callback(...args)),

  // 👋 Hello function ทดสอบ
  sayHello: (name) => {
    console.log('👋 [PRELOAD] ส่งคำทักทาย:', name);
    return ipcRenderer.invoke('say-hello', name);
  }
});

console.log('✅ [PRELOAD] Security bridge พร้อมแล้ว');

// เพิ่มส่วนนี้ใน preload.js

contextBridge.exposeInMainWorld('electronAPI', {
  // ฟังก์ชันเดิม
  sendMessage: (message) => {
    console.log('📤 [PRELOAD] ส่งข้อความ:', message);
    return ipcRenderer.invoke('send-message', message);
  },
  
  sayHello: (name) => {
    console.log('👋 [PRELOAD] ส่งคำทักทาย:', name);
    return ipcRenderer.invoke('say-hello', name);
  },
  
  // ฟังก์ชันใหม่สำหรับ agent wallboard
  getAgents: () => {
    console.log('📊 [PRELOAD] ร้องขอข้อมูล agents');
    return ipcRenderer.invoke('get-agents');
  },
  
  changeAgentStatus: (agentId, newStatus) => {
    console.log(`🔄 [PRELOAD] เปลี่ยนสถานะ ${agentId} เป็น ${newStatus}`);
    return ipcRenderer.invoke('change-agent-status', { agentId, newStatus });
  }
});