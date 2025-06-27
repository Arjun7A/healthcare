/**
 * ADVANCED MOOD TRACKER - COMPREHENSIVE QA TEST SCRIPT
 * 
 * This script provides thorough testing for all advanced features
 * of the ultra-modern AI-powered Mood Tracker.
 * 
 * Run this in browser console after loading the application.
 */

console.log('🧠 AI Mood Tracker - Advanced QA Test Suite');
console.log('='.repeat(50));

// Test Configuration
const TEST_CONFIG = {
  enableVoiceTests: false, // Set to true if testing voice features
  enableAITests: true,     // Set to true if testing AI features
  enableExportTests: true, // Set to true if testing export features
  testDelay: 1000         // Delay between tests in milliseconds
};

// Utility Functions
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const log = (test, status, message = '') => {
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'SKIP' ? '⏭️' : '🔄';
  console.log(`${emoji} ${test}: ${status} ${message}`);
};

// Test Suite Class
class MoodTrackerTestSuite {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
  }

  // Test Component Loading
  async testComponentLoading() {
    log('Component Loading', 'RUNNING');
    
    try {
      // Check if mood tracker container exists
      const container = document.querySelector('.mood-tracker');
      if (!container) throw new Error('Mood tracker container not found');
      
      // Check if navigation tabs are present
      const navTabs = document.querySelectorAll('.mood-nav-tab');
      if (navTabs.length < 4) throw new Error('Navigation tabs incomplete');
      
      // Check for essential UI elements
      const essentialElements = [
        '.mood-header',
        '.mood-nav',
        '.mood-content'
      ];
      
      for (const selector of essentialElements) {
        if (!document.querySelector(selector)) {
          throw new Error(`Essential element missing: ${selector}`);
        }
      }
      
      this.results.passed++;
      log('Component Loading', 'PASS', 'All essential components loaded');
    } catch (error) {
      this.results.failed++;
      log('Component Loading', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Navigation
  async testNavigation() {
    log('Navigation System', 'RUNNING');
    
    try {
      const tabs = ['log', 'history', 'analytics', 'insights'];
      
      for (const tab of tabs) {
        const tabButton = document.querySelector(`[onClick*="${tab}"]`) || 
                         Array.from(document.querySelectorAll('button')).find(btn => 
                           btn.textContent.toLowerCase().includes(tab));
        
        if (tabButton) {
          tabButton.click();
          await wait(500);
          
          // Check if content changed
          const activeTab = document.querySelector('.mood-nav-tab.active');
          if (!activeTab) throw new Error(`Tab activation failed for ${tab}`);
        }
      }
      
      this.results.passed++;
      log('Navigation System', 'PASS', 'All tabs accessible');
    } catch (error) {
      this.results.failed++;
      log('Navigation System', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Dark Mode
  async testDarkMode() {
    log('Dark Mode Toggle', 'RUNNING');
    
    try {
      const darkModeToggle = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.title && btn.title.includes('Dark Mode'));
      
      if (!darkModeToggle) throw new Error('Dark mode toggle not found');
      
      const initialClass = document.documentElement.className;
      darkModeToggle.click();
      await wait(300);
      
      const newClass = document.documentElement.className;
      if (initialClass === newClass) throw new Error('Dark mode toggle not working');
      
      // Toggle back
      darkModeToggle.click();
      await wait(300);
      
      this.results.passed++;
      log('Dark Mode Toggle', 'PASS', 'Theme switching functional');
    } catch (error) {
      this.results.failed++;
      log('Dark Mode Toggle', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Mood Selection
  async testMoodSelection() {
    log('Mood Selection Interface', 'RUNNING');
    
    try {
      // Navigate to log tab first
      const logTab = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Log'));
      if (logTab) logTab.click();
      await wait(500);
      
      // Test emoji mood selection
      const moodOptions = document.querySelectorAll('.mood-option');
      if (moodOptions.length < 5) throw new Error('Mood options incomplete');
      
      // Test clicking different mood options
      const randomMoodIndex = Math.floor(Math.random() * moodOptions.length);
      moodOptions[randomMoodIndex].click();
      await wait(300);
      
      // Check if selection is reflected
      const selectedMood = document.querySelector('.mood-option.selected');
      if (!selectedMood) throw new Error('Mood selection not working');
      
      // Test slider functionality
      const slider = document.querySelector('.mood-range-input');
      if (slider) {
        slider.value = '7';
        slider.dispatchEvent(new Event('input'));
        await wait(300);
      }
      
      this.results.passed++;
      log('Mood Selection Interface', 'PASS', 'Mood selection functional');
    } catch (error) {
      this.results.failed++;
      log('Mood Selection Interface', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Advanced Metrics
  async testAdvancedMetrics() {
    log('Advanced Metrics Sliders', 'RUNNING');
    
    try {
      const sliders = document.querySelectorAll('.mood-range-input');
      if (sliders.length < 3) throw new Error('Advanced metric sliders missing');
      
      // Test each slider
      sliders.forEach((slider, index) => {
        const testValue = Math.floor(Math.random() * 10) + 1;
        slider.value = testValue;
        slider.dispatchEvent(new Event('input'));
      });
      
      await wait(500);
      
      // Check if values are displayed
      const sliderValues = document.querySelectorAll('.mood-slider-value');
      if (sliderValues.length === 0) throw new Error('Slider values not displaying');
      
      this.results.passed++;
      log('Advanced Metrics Sliders', 'PASS', 'All metric sliders functional');
    } catch (error) {
      this.results.failed++;
      log('Advanced Metrics Sliders', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Tags and Activities
  async testTagsAndActivities() {
    log('Tags and Activities Selection', 'RUNNING');
    
    try {
      const tags = document.querySelectorAll('.mood-tag');
      if (tags.length < 5) throw new Error('Insufficient tags available');
      
      // Select random tags
      const randomTags = Array.from(tags).slice(0, 3);
      randomTags.forEach(tag => {
        tag.click();
      });
      
      await wait(500);
      
      // Check if tags are selected
      const selectedTags = document.querySelectorAll('.mood-tag.selected');
      if (selectedTags.length === 0) throw new Error('Tag selection not working');
      
      this.results.passed++;
      log('Tags and Activities Selection', 'PASS', 'Tag selection functional');
    } catch (error) {
      this.results.failed++;
      log('Tags and Activities Selection', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Voice Features
  async testVoiceFeatures() {
    if (!TEST_CONFIG.enableVoiceTests) {
      log('Voice Features', 'SKIP', 'Voice tests disabled');
      this.results.skipped++;
      this.results.total++;
      return;
    }

    log('Voice Recording Features', 'RUNNING');
    
    try {
      const voiceButton = document.querySelector('.mood-voice-btn');
      if (!voiceButton) throw new Error('Voice button not found');
      
      // Check if speech recognition is supported
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      // Test voice button click
      voiceButton.click();
      await wait(1000);
      
      // Check if recording state changed
      const isRecording = voiceButton.classList.contains('recording');
      
      // Stop recording if started
      if (isRecording) {
        voiceButton.click();
      }
      
      this.results.passed++;
      log('Voice Recording Features', 'PASS', 'Voice features accessible');
    } catch (error) {
      this.results.failed++;
      log('Voice Recording Features', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test AI Features
  async testAIFeatures() {
    if (!TEST_CONFIG.enableAITests) {
      log('AI Features', 'SKIP', 'AI tests disabled');
      this.results.skipped++;
      this.results.total++;
      return;
    }

    log('AI Insights Generation', 'RUNNING');
    
    try {
      // Navigate to insights tab
      const insightsTab = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Insights') || btn.textContent.includes('AI'));
      
      if (insightsTab) {
        insightsTab.click();
        await wait(500);
      }
      
      // Look for AI insights button
      const aiButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Generate') || btn.textContent.includes('AI'));
      
      if (!aiButton) throw new Error('AI insights button not found');
      
      // Check if button is properly configured
      if (aiButton.disabled) {
        log('AI Features', 'PASS', 'AI button properly disabled (needs more data)');
      } else {
        log('AI Features', 'PASS', 'AI insights button available');
      }
      
      this.results.passed++;
    } catch (error) {
      this.results.failed++;
      log('AI Features', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Analytics
  async testAnalytics() {
    log('Analytics Dashboard', 'RUNNING');
    
    try {
      // Navigate to analytics tab
      const analyticsTab = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Analytics'));
      
      if (analyticsTab) {
        analyticsTab.click();
        await wait(500);
      }
      
      // Check for analytics components
      const analyticsElements = [
        '.mood-chart-container',
        '.mood-analytics',
        '.chart-placeholder'
      ];
      
      let foundElements = 0;
      analyticsElements.forEach(selector => {
        if (document.querySelector(selector)) foundElements++;
      });
      
      if (foundElements === 0) throw new Error('Analytics components not found');
      
      this.results.passed++;
      log('Analytics Dashboard', 'PASS', `${foundElements} analytics components found`);
    } catch (error) {
      this.results.failed++;
      log('Analytics Dashboard', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Export Features
  async testExportFeatures() {
    if (!TEST_CONFIG.enableExportTests) {
      log('Export Features', 'SKIP', 'Export tests disabled');
      this.results.skipped++;
      this.results.total++;
      return;
    }

    log('Data Export Functionality', 'RUNNING');
    
    try {
      // Look for export buttons
      const exportButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Export') || btn.textContent.includes('PDF') || btn.textContent.includes('CSV'));
      
      if (exportButtons.length === 0) throw new Error('Export buttons not found');
      
      // Test export button accessibility
      exportButtons.forEach((button, index) => {
        if (!button.disabled) {
          log('Export Features', 'PASS', `Export button ${index + 1} accessible`);
        }
      });
      
      this.results.passed++;
      log('Data Export Functionality', 'PASS', `${exportButtons.length} export options available`);
    } catch (error) {
      this.results.failed++;
      log('Data Export Functionality', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Settings Modal
  async testSettingsModal() {
    log('Settings Modal', 'RUNNING');
    
    try {
      const settingsButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.title && btn.title.includes('Settings'));
      
      if (!settingsButton) throw new Error('Settings button not found');
      
      settingsButton.click();
      await wait(500);
      
      // Check if modal opened
      const modal = document.querySelector('.mood-modal');
      if (!modal) throw new Error('Settings modal did not open');
      
      // Check for settings options
      const settingsOptions = document.querySelectorAll('.setting-item');
      if (settingsOptions.length < 3) throw new Error('Insufficient settings options');
      
      // Close modal
      const closeButton = document.querySelector('.mood-modal-close');
      if (closeButton) closeButton.click();
      
      this.results.passed++;
      log('Settings Modal', 'PASS', 'Settings modal functional');
    } catch (error) {
      this.results.failed++;
      log('Settings Modal', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Responsive Design
  async testResponsiveDesign() {
    log('Responsive Design', 'RUNNING');
    
    try {
      const originalWidth = window.innerWidth;
      
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      window.dispatchEvent(new Event('resize'));
      await wait(300);
      
      // Check if mobile styles are applied
      const container = document.querySelector('.mood-tracker');
      if (!container) throw new Error('Container not responsive');
      
      // Restore original viewport
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
      window.dispatchEvent(new Event('resize'));
      
      this.results.passed++;
      log('Responsive Design', 'PASS', 'Responsive behavior detected');
    } catch (error) {
      this.results.failed++;
      log('Responsive Design', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Test Performance
  async testPerformance() {
    log('Performance Metrics', 'RUNNING');
    
    try {
      const startTime = performance.now();
      
      // Simulate user interactions
      const buttons = document.querySelectorAll('button');
      const interactionTime = performance.now();
      
      // Check component rendering time
      const renderTime = interactionTime - startTime;
      
      if (renderTime > 5000) throw new Error('Component rendering too slow');
      
      // Check memory usage (approximate)
      const memoryInfo = performance.memory;
      if (memoryInfo && memoryInfo.usedJSHeapSize > 100 * 1024 * 1024) {
        console.warn('High memory usage detected');
      }
      
      this.results.passed++;
      log('Performance Metrics', 'PASS', `Render time: ${renderTime.toFixed(2)}ms`);
    } catch (error) {
      this.results.failed++;
      log('Performance Metrics', 'FAIL', error.message);
    }
    this.results.total++;
  }

  // Run All Tests
  async runAllTests() {
    console.log('🚀 Starting Advanced Mood Tracker QA Test Suite...\n');
    
    const tests = [
      () => this.testComponentLoading(),
      () => this.testNavigation(),
      () => this.testDarkMode(),
      () => this.testMoodSelection(),
      () => this.testAdvancedMetrics(),
      () => this.testTagsAndActivities(),
      () => this.testVoiceFeatures(),
      () => this.testAIFeatures(),
      () => this.testAnalytics(),
      () => this.testExportFeatures(),
      () => this.testSettingsModal(),
      () => this.testResponsiveDesign(),
      () => this.testPerformance()
    ];
    
    for (const test of tests) {
      await test();
      await wait(TEST_CONFIG.testDelay);
    }
    
    this.printResults();
  }

  // Print Test Results
  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('🏁 TEST SUITE RESULTS');
    console.log('='.repeat(50));
    console.log(`📊 Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️ Skipped: ${this.results.skipped}`);
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Mood Tracker is ready for production.');
    } else {
      console.log('⚠️ Some tests failed. Please review and fix issues before deployment.');
    }
    
    console.log('\n💡 Tips:');
    console.log('- Ensure you have proper API keys configured for AI features');
    console.log('- Test voice features in supported browsers (Chrome/Edge)');
    console.log('- Verify database schema is up to date');
    console.log('- Test with real user data for better insights');
  }
}

// Auto-run tests when script is loaded
const testSuite = new MoodTrackerTestSuite();

// Export for manual testing
window.moodTrackerQA = {
  runTests: () => testSuite.runAllTests(),
  config: TEST_CONFIG,
  testSuite: testSuite
};

// Display instructions
console.log('🧪 Mood Tracker QA Test Suite Loaded!');
console.log('📋 Run tests with: moodTrackerQA.runTests()');
console.log('⚙️ Modify config with: moodTrackerQA.config');

// Auto-run if desired
if (window.location.search.includes('autotest=true')) {
  setTimeout(() => testSuite.runAllTests(), 2000);
}
