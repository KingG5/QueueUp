<template>
    <div class="auth-layout">
      <div class="auth-background"></div>
      <div class="auth-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AuthLayout'
  }
  </script>
  
  <style lang="scss" scoped>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  
  .auth-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0066ff 0%, #4361ee 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%);
    opacity: 0.9;
    z-index: 0;
  }
  
  .auth-content {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  </style>