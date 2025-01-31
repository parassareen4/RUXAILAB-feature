<template>
  <v-container>
    <v-card class="pa-4 rounded-lg">
      <v-card-title class="headline">WCAG Accessibility Evaluation</v-card-title>
      
      <!-- URL Input -->
      <v-text-field
        v-model="url"
        label="Website URL"
        placeholder="https://example.com"
        :rules="urlRules"
        outlined
        clearable
        @keyup.enter="startEvaluation"
      />

      <!-- WCAG Version Selection -->
      <v-select
        v-model="wcagVersion"
        :items="['WCAG 2.0', 'WCAG 2.1', 'WCAG 2.2']"
        label="WCAG Version"
        outlined
      />

      <!-- Compliance Level -->
      <v-select
        v-model="complianceLevel"
        :items="['A', 'AA', 'AAA']"
        label="Compliance Level"
        outlined
      />

      <!-- Evaluation Categories -->
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(category, index) in categories"
          :key="index"
        >
          <v-expansion-panel-header>
            {{ category.name }} (Score: {{ category.score }}/100)
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item v-for="(criterion, cIndex) in category.criteria" :key="cIndex">
                <v-list-item-content>
                  <v-list-item-title>{{ criterion.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ criterion.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-rating
                    v-model="criterion.score"
                    color="orange"
                    background-color="grey lighten-2"
                    hover
                    length="5"
                    size="24"
                    @input="updateCategoryScore(index)"
                  />
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Overall Score -->
      <v-card class="mt-4 pa-4" outlined>
        <v-card-title class="headline">
          Overall Accessibility Score: {{ overallScore }}%
        </v-card-title>
        <v-progress-linear
          :value="overallScore"
          color="orange"
          height="25"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-card>

      <!-- Action Buttons -->
      <v-card-actions class="mt-4">
        <v-spacer />
        <v-btn
          color="orange"
          dark
          @click="generateReport"
          :loading="loading"
        >
          Generate Report
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'WcagEvaluation',
  data: () => ({
    url: '',
    wcagVersion: 'WCAG 2.1',
    complianceLevel: 'AA',
    loading: false,
    urlRules: [
      v => !!v || 'URL is required',
      v => /^(http|https):\/\/[^ "]+$/.test(v) || 'URL must be valid'
    ],
    categories: [
      {
        name: 'Perceivable',
        score: 0,
        criteria: [
          { name: 'Text Alternatives', description: 'Provide text alternatives for non-text content', score: 0 },
          { name: 'Time-based Media', description: 'Provide alternatives for time-based media', score: 0 },
          { name: 'Adaptable', description: 'Create content that can be presented in different ways', score: 0 },
          { name: 'Distinguishable', description: 'Make it easier for users to see and hear content', score: 0 }
        ]
      },
      {
        name: 'Operable',
        score: 0,
        criteria: [
          { name: 'Keyboard Accessible', description: 'Make all functionality available from a keyboard', score: 0 },
          { name: 'Enough Time', description: 'Provide users enough time to read and use content', score: 0 },
          { name: 'Seizures', description: 'Do not design content in a way that is known to cause seizures', score: 0 },
          { name: 'Navigable', description: 'Provide ways to help users navigate, find content, and determine where they are', score: 0 }
        ]
      },
      // Add more categories as needed
    ]
  }),
  computed: {
    overallScore() {
      if (this.categories.length === 0) return 0;
      const total = this.categories.reduce((acc, cat) => acc + cat.score, 0);
      return Math.round(total / this.categories.length);
    }
  },
  methods: {
    updateCategoryScore(categoryIndex) {
      const category = this.categories[categoryIndex];
      const totalCriteria = category.criteria.length;
      const totalScore = category.criteria.reduce((acc, criterion) => acc + criterion.score, 0);
      category.score = Math.round((totalScore / (totalCriteria * 5)) * 100);
    },
    async generateReport() {
      this.loading = true;
      try {
        const reportData = {
          url: this.url,
          wcagVersion: this.wcagVersion,
          complianceLevel: this.complianceLevel,
          categories: this.categories,
          overallScore: this.overallScore,
          timestamp: new Date().toISOString()
        };
        
        // Use your existing report generator utility
        await this.$store.dispatch('generateWcagReport', reportData);
        this.$toast.success('Report generated successfully');
      } catch (error) {
        this.$toast.error('Error generating report');
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script> 