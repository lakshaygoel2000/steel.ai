class SteelIndustryBot {
    constructor() {
        this.projectParams = {};
        this.chatHistory = [];
        this.isTyping = false;
        this.currentEditParam = null;
        
        this.sampleResponses = {
            foundation: "Based on your {constructionType} construction with {plotSize} sq ft, I recommend considering the soil conditions carefully. For {houseType} buildings, {foundationType} foundations typically work well, but we should analyze the bearing capacity requirements.",
            steel: "For your {stories}-story {houseType} project, steel frame construction offers excellent strength-to-weight ratio. With {plotSize} sq ft, we'll need to consider beam spans and column spacing for optimal structural efficiency.",
            roof: "Your {roofType} roof selection is suitable for {constructionType} construction. For a {stories}-story building, we need to ensure proper load transfer from the roof to the foundation through the steel framework.",
            general: "For your {plotSize} sq ft {houseType} project with {constructionType} construction, I can provide specific guidance on steel specifications, connections, and building codes compliance."
        };

        this.dropdownOptions = {
            constructionType: ["Steel Frame", "Concrete Frame", "Wood Frame", "Hybrid"],
            stories: ["1", "2", "3", "4", "5+"],
            houseType: ["Residential", "Commercial", "Industrial", "Warehouse"],
            foundationType: ["Slab-on-Grade", "T-Shaped", "Basement", "Crawl Space", "Pile Foundation"],
            roofType: ["Gable", "Hip", "Shed", "Gambrel", "Flat", "Truss System"]
        };

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.bindEvents();
        this.setupChatInput();
    }

    bindEvents() {
        // Project form submission
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProjectSubmission();
            });
        }

        // Chat form submission
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChatSubmission();
            });
        }

        // Parameter edit buttons - use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-param-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const paramName = e.target.getAttribute('data-param');
                this.openEditModal(paramName);
            }
        });

        // Modal events
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeEditModal();
            });
        }

        const modalCancel = document.getElementById('modal-cancel');
        if (modalCancel) {
            modalCancel.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeEditModal();
            });
        }

        const modalSave = document.getElementById('modal-save');
        if (modalSave) {
            modalSave.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveParameterEdit();
            });
        }

        // Close modal on backdrop click
        const editModal = document.getElementById('edit-modal');
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    this.closeEditModal();
                }
            });
        }

        // Handle escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
        });
    }

    setupChatInput() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;
        
        // Auto-resize textarea
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        });

        // Handle Enter key (send message) and Shift+Enter (new line)
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const chatForm = document.getElementById('chat-form');
                if (chatForm) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    chatForm.dispatchEvent(submitEvent);
                }
            }
        });
    }

    handleProjectSubmission() {
        const form = document.getElementById('project-form');
        if (!form) return;

        const formData = new FormData(form);
        
        // Validate required fields
        const requiredFields = ['plotSize', 'constructionType', 'stories', 'houseType', 'foundationType', 'roofType', 'firstQuery'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            alert('Please fill in all required fields before submitting.');
            return;
        }

        // Store project parameters
        this.projectParams = {
            plotSize: formData.get('plotSize'),
            constructionType: formData.get('constructionType'),
            stories: formData.get('stories'),
            houseType: formData.get('houseType'),
            foundationType: formData.get('foundationType'),
            roofType: formData.get('roofType'),
            specialRequirements: formData.get('specialRequirements') || 'None'
        };

        const firstQuery = formData.get('firstQuery');

        // Transition to chat interface
        this.showChatInterface();
        this.displayParameters();
        
        // Add first message and response
        this.addMessage('user', firstQuery);
        this.generateResponse(firstQuery);
    }

    showChatInterface() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const chatInterface = document.getElementById('chat-interface');
        
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
        if (chatInterface) {
            chatInterface.classList.remove('hidden');
        }
    }

    displayParameters() {
        const paramElements = {
            'param-plotSize': `${this.projectParams.plotSize} sq ft`,
            'param-constructionType': this.projectParams.constructionType,
            'param-stories': this.projectParams.stories,
            'param-houseType': this.projectParams.houseType,
            'param-foundationType': this.projectParams.foundationType,
            'param-roofType': this.projectParams.roofType
        };

        for (const [elementId, value] of Object.entries(paramElements)) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            }
        }
    }

    handleChatSubmission() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;

        const message = chatInput.value.trim();
        
        if (!message || this.isTyping) return;

        this.addMessage('user', message);
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        this.generateResponse(message);
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'U' : 'AI';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageContent.appendChild(messageTime);
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);

        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // Store in chat history
        this.chatHistory.push({ sender, content, timestamp: new Date() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'message assistant';
        typingElement.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'AI';

        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        typingContent.innerHTML = `
            <span>AI is thinking</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        typingElement.appendChild(avatar);
        typingElement.appendChild(typingContent);
        messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async generateResponse(userMessage) {
        this.isTyping = true;
        this.showTypingIndicator();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

        this.removeTypingIndicator();
        this.isTyping = false;

        const response = this.getContextualResponse(userMessage);
        this.addMessage('assistant', response);
    }

    getContextualResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';

        // Determine response type based on keywords
        if (message.includes('foundation') || message.includes('footing') || message.includes('basement')) {
            response = this.sampleResponses.foundation;
        } else if (message.includes('steel') || message.includes('beam') || message.includes('column') || message.includes('frame')) {
            response = this.sampleResponses.steel;
        } else if (message.includes('roof') || message.includes('truss') || message.includes('rafter')) {
            response = this.sampleResponses.roof;
        } else {
            // Generate contextual responses based on different topics
            const responses = [
                `For your ${this.projectParams.plotSize} sq ft ${this.projectParams.houseType} project, let me provide some insights on steel construction best practices. With ${this.projectParams.constructionType} construction, we need to consider load distribution and structural integrity.`,
                
                `Based on your ${this.projectParams.stories}-story ${this.projectParams.houseType} building specifications, I recommend focusing on proper steel connections and joint details. The ${this.projectParams.foundationType} foundation will need to support the steel frame adequately.`,
                
                `Your ${this.projectParams.roofType} roof design works well with ${this.projectParams.constructionType} construction. For a ${this.projectParams.plotSize} sq ft building, we should consider wind loads and seismic requirements based on your local building codes.`,
                
                `Steel construction offers excellent benefits for your ${this.projectParams.houseType} project. With ${this.projectParams.stories} stories and ${this.projectParams.plotSize} sq ft, we can optimize the structural design for both cost and performance.`,
                
                `Let me address your question about this ${this.projectParams.constructionType} project. The combination of ${this.projectParams.foundationType} foundation and ${this.projectParams.roofType} roof requires careful structural analysis to ensure proper load paths.`
            ];
            
            response = responses[Math.floor(Math.random() * responses.length)];
        }

        // Replace placeholders with actual parameters
        return this.replacePlaceholders(response);
    }

    replacePlaceholders(text) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return this.projectParams[key] || match;
        });
    }

    openEditModal(paramName) {
        if (!paramName) return;

        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalLabel = document.getElementById('modal-label');
        const modalInput = document.getElementById('modal-input');
        const modalSelect = document.getElementById('modal-select');
        const modalTextarea = document.getElementById('modal-textarea');

        if (!modal || !modalTitle || !modalLabel || !modalInput || !modalSelect || !modalTextarea) {
            return;
        }

        // Hide all inputs
        modalInput.classList.add('hidden');
        modalSelect.classList.add('hidden');
        modalTextarea.classList.add('hidden');

        // Set title and label
        const displayName = this.getParamDisplayName(paramName);
        modalTitle.textContent = `Edit ${displayName}`;
        modalLabel.textContent = displayName;

        // Set current value and show appropriate input
        const currentValue = this.projectParams[paramName];

        if (paramName === 'plotSize') {
            modalInput.classList.remove('hidden');
            modalInput.type = 'number';
            modalInput.min = '100';
            modalInput.step = '100';
            modalInput.value = currentValue;
            modalInput.focus();
        } else if (paramName === 'specialRequirements') {
            modalTextarea.classList.remove('hidden');
            modalTextarea.value = currentValue === 'None' ? '' : currentValue;
            modalTextarea.focus();
        } else if (this.dropdownOptions[paramName]) {
            modalSelect.classList.remove('hidden');
            modalSelect.innerHTML = '<option value="">Select...</option>';
            
            this.dropdownOptions[paramName].forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (option === currentValue) {
                    optionElement.selected = true;
                }
                modalSelect.appendChild(optionElement);
            });
            modalSelect.focus();
        }

        this.currentEditParam = paramName;
        modal.classList.remove('hidden');
    }

    closeEditModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditParam = null;
    }

    saveParameterEdit() {
        if (!this.currentEditParam) return;

        const modalInput = document.getElementById('modal-input');
        const modalSelect = document.getElementById('modal-select');
        const modalTextarea = document.getElementById('modal-textarea');

        let newValue = '';

        if (modalInput && !modalInput.classList.contains('hidden')) {
            newValue = modalInput.value.trim();
        } else if (modalSelect && !modalSelect.classList.contains('hidden')) {
            newValue = modalSelect.value;
        } else if (modalTextarea && !modalTextarea.classList.contains('hidden')) {
            newValue = modalTextarea.value.trim() || 'None';
        }

        if (newValue && newValue !== this.projectParams[this.currentEditParam]) {
            this.projectParams[this.currentEditParam] = newValue;
            this.displayParameters();
            
            // Add system message about parameter change
            const displayName = this.getParamDisplayName(this.currentEditParam);
            this.addMessage('assistant', `I've updated your ${displayName} to: ${newValue}. This change will be considered in all future responses.`);
        }

        this.closeEditModal();
    }

    getParamDisplayName(paramName) {
        const displayNames = {
            plotSize: 'Plot Size',
            constructionType: 'Construction Type',
            stories: 'Number of Stories',
            houseType: 'Building Type',
            foundationType: 'Foundation Type',
            roofType: 'Roof Type',
            specialRequirements: 'Special Requirements'
        };
        return displayNames[paramName] || paramName;
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }
}

// Initialize the application
new SteelIndustryBot();