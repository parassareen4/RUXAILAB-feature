<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" outlined>
          <v-card-title class="text-h5 justify-center mb-6">
            Analyzing {{ url }}
          </v-card-title>

          <!-- Progress Timeline -->
          <v-timeline dense>
            <v-timeline-item
              v-for="(stage, index) in stages"
              :key="index"
              :color="getStageColor(stage)"
              :icon="getStageIcon(stage)"
              fill-dot
            >
              <v-card flat>
                <v-card-text class="py-0">
                  <div class="font-weight-bold">{{ stage.name }}</div>
                  <div class="text--secondary" v-if="stage.details">
                    {{ stage.details }}
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>

          <!-- Overall Progress -->
          <v-card-text class="text-center mt-4">
            <v-progress-circular
              :size="70"
              :width="7"
              :value="progress"
              color="primary"
            >
              {{ progress }}%
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { evaluationSys } from '@/utils/evaluationSys'

export default {
  name: 'WcagLoadingScreen',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      progress: 0,
      stages: [
        { name: 'Fetching Content', status: 'pending', details: 'Getting website content' },
        { name: 'Structure Analysis', status: 'pending', details: 'Checking HTML structure' },
        { name: 'Accessibility Check', status: 'pending', details: 'Validating accessibility' },
        { name: 'Final Evaluation', status: 'pending', details: 'Compiling results' }
      ]
    };
  },
  methods: {
    getStageColor(stage) {
      switch (stage.status) {
        case 'complete': return 'success'
        case 'processing': return 'primary'
        case 'error': return 'error'
        default: return 'grey'
      }
    },
    getStageIcon(stage) {
      switch (stage.status) {
        case 'complete': return 'mdi-check-circle'
        case 'processing': return 'mdi-loading mdi-spin'
        case 'error': return 'mdi-alert-circle'
        default: return 'mdi-circle-small'
      }
    },
    updateProgress(stage, status, details) {
      // Update the loading bar and stage details
      this.stages = this.stages.map(s => {
        if (s.name === stage) {
          return { ...s, status, details };
        }
        return s;
      });

      // Update the progress value
      this.progress = this.calculateProgress();
    },
    calculateProgress() {
      const completedStages = this.stages.filter(s => s.status === 'complete').length;
      const totalStages = this.stages.length;

      // Prevent NaN by ensuring totalStages is not zero
      if (totalStages === 0) return 0; // or return 100 if you want to consider it complete

      return Math.round((completedStages / totalStages) * 100);
    },
    async startAnalysis() {
      try {
        // Perform the actual analysis
        this.results = await evaluationSys.evaluateWebsite(this.url, (stage, status, details) => {
          this.updateProgress(stage, status, details);
        });

        console.log('Progress:', this.progress); // Check the progress value

        // Redirect to results after analysis is complete
        if (this.progress === 100) {
          this.$nextTick(() => {
            this.$router.push({
              name: 'Results',
              params: { results: this.results }
            });
          });
        }
      } catch (error) {
        console.error('Analysis failed:', error);
        // Handle error (e.g., show an error message)
      }
    }
  },
  mounted() {
    this.startAnalysis()
  }
}
</script> 