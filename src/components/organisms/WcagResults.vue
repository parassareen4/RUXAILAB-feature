<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Overall Score Card -->
        <v-card class="mb-6">
          <v-card-title class="text-h4 d-flex justify-space-between align-center">
            <span>Accessibility Evaluation Results</span>
            <v-chip
              :color="getScoreColor(summary.score)"
              large
              class="ml-4"
              dark
            >
              Score: {{ summary.score }}%
            </v-chip>
          </v-card-title>
          <v-card-subtitle class="text-h6">
            {{ url }}
          </v-card-subtitle>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <v-progress-circular
                      :value="summary.score"
                      :color="getScoreColor(summary.score)"
                      size="150"
                      width="15"
                    >
                      <span class="text-h4">{{ summary.score }}%</span>
                    </v-progress-circular>
                    <div class="mt-4">
                      <v-chip
                        :color="getScoreColor(summary.score)"
                        dark
                        large
                      >
                        {{ summary.level }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card outlined height="100%">
                  <v-card-title>Issues Overview</v-card-title>
                  <v-card-text>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="error">mdi-alert-circle</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ summary.criticalIssues }} Critical Issues
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="warning">mdi-alert</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ summary.majorIssues }} Major Issues
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="info">mdi-information</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ summary.minorIssues }} Minor Issues
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Principle Scores -->
            <v-row class="mt-6">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-title>Principle Scores</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                        v-for="(principle, index) in detailedScores"
                        :key="index"
                        cols="12"
                        md="6"
                      >
                        <v-card flat>
                          <v-card-text>
                            <div class="d-flex align-center mb-2">
                              <v-icon
                                :color="getScoreColor(principle.score)"
                                class="mr-2"
                              >
                                {{ principle.icon }}
                              </v-icon>
                              <span class="text-h6">{{ principle.name }}</span>
                            </div>
                            <v-progress-linear
                              :value="principle.score"
                              :color="getScoreColor(principle.score)"
                              height="25"
                              class="rounded-lg"
                            >
                              <template v-slot:default="{ value }">
                                <strong>{{ Math.ceil(value) }}%</strong>
                              </template>
                            </v-progress-linear>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Priority Recommendations -->
            <v-row class="mt-6">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between align-center">
                    <span>Priority Recommendations</span>
                    <v-btn
                      color="orange"
                      dark
                      @click="generateReport"
                      :loading="generating"
                    >
                      <v-icon left>mdi-file-pdf-box</v-icon>
                      Download Full Report
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-timeline dense>
                      <v-timeline-item
                        v-for="(rec, index) in recommendations"
                        :key="index"
                        :color="getRecommendationColor(rec.priority)"
                        small
                      >
                        <div class="d-flex justify-space-between">
                          <div>
                            <div class="font-weight-bold">
                              {{ rec.category }}: {{ rec.name }}
                            </div>
                            <div class="text--secondary mt-1">
                              {{ rec.recommendation }}
                            </div>
                          </div>
                          <v-chip
                            small
                            :color="getRecommendationColor(rec.priority)"
                            dark
                          >
                            {{ rec.priority }}
                          </v-chip>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              color="orange"
              @click="$router.push('/wcag-evaluation')"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Back to Evaluation
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              @click="startNewEvaluation"
            >
              <v-icon left>mdi-refresh</v-icon>
              New Evaluation
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { evaluationSys } from '@/utils/evaluationSys'

export default {
  name: 'WcagResults',
  data: () => ({
    url: '',
    generating: false,
    summary: {},
    detailedScores: [],
    recommendations: [],
    complianceBreakdown: {}
  }),
  methods: {
    getScoreColor(score) {
      if (score >= 90) return 'success'
      if (score >= 70) return 'warning'
      return 'error'
    },
    getRecommendationColor(priority) {
      switch (priority.toLowerCase()) {
        case 'high': return 'error'
        case 'medium': return 'warning'
        case 'low': return 'info'
        default: return 'grey'
      }
    },
    async generateReport() {
      this.generating = true
      try {
        const reportData = {
          url: this.url,
          summary: this.summary,
          detailedScores: this.detailedScores,
          recommendations: this.recommendations,
          complianceBreakdown: this.complianceBreakdown
        }
        await this.$store.dispatch('generateWcagReport', reportData)
        this.$toast.success('Report downloaded successfully')
      } catch (error) {
        this.$toast.error('Error generating report')
        console.error(error)
      } finally {
        this.generating = false
      }
    },
    startNewEvaluation() {
      this.$router.push('/createBlank')
    }
  },
  created() {
    // Get evaluation results from route params or store
    const results = this.$route.params.results
    if (!results) {
      this.$router.push('/createBlank')
      return
    }

    this.url = results.url
    this.summary = results.summary
    this.detailedScores = results.detailedScores
    this.recommendations = results.recommendations
    this.complianceBreakdown = results.complianceBreakdown
  }
}
</script> 