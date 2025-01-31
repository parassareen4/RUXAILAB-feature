<template>
  <v-container fluid>
    <!-- Main Evaluation Section -->
    <v-row justify="center" v-if="!evaluationComplete">
      <v-col cols="12" md="10">
        <v-card class="mb-6">
          <v-card-title class="text-h5 d-flex align-center">
            <v-icon large color="orange" class="mr-2">mdi-web</v-icon>
            {{ url }}
          </v-card-title>
          
          <v-progress-linear
            :value="evaluationProgress"
            color="orange"
            height="25"
            class="ma-4"
          >
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}% Complete</strong>
            </template>
          </v-progress-linear>
        </v-card>

        <v-expansion-panels>
          <v-expansion-panel
            v-for="(principle, index) in wcagPrinciples"
            :key="index"
          >
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="8" class="d-flex align-center">
                  <v-icon color="orange" class="mr-2">{{ principle.icon }}</v-icon>
                  {{ principle.name }}
                </v-col>
                <v-col cols="4" class="text-right">
                  <v-chip
                    :color="getScoreColor(principle.score)"
                    text-color="white"
                  >
                    Score: {{ principle.score }}%
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat>
                <v-card-text>
                  <v-row
                    v-for="(criterion, cIndex) in principle.criteria"
                    :key="cIndex"
                    align="center"
                    class="mb-4"
                  >
                    <v-col cols="12" md="6">
                      <div class="d-flex align-center">
                        <v-icon
                          small
                          :color="getCriterionColor(criterion.compliance)"
                          class="mr-2"
                        >
                          {{ getCriterionIcon(criterion.compliance) }}
                        </v-icon>
                        <div>
                          <strong>{{ criterion.name }}</strong>
                          <div class="subtitle-2 grey--text text--darken-1">
                            {{ criterion.description }}
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="criterion.compliance"
                        :items="complianceOptions"
                        label="Compliance Level"
                        dense
                        outlined
                        @change="updateScores"
                      >
                        <template v-slot:selection="{ item }">
                          <v-icon
                            small
                            :color="getComplianceColor(item.value)"
                            class="mr-2"
                          >
                            {{ getComplianceIcon(item.value) }}
                          </v-icon>
                          {{ item.text }}
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-btn
                        text
                        small
                        color="orange"
                        @click="showGuideDialog(criterion)"
                      >
                        <v-icon left>mdi-help-circle</v-icon>
                        Guide
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card class="mt-6">
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="orange"
              dark
              :disabled="!isEvaluationComplete"
              @click="finishEvaluation"
            >
              View Results
              <v-icon right>mdi-chart-bar</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Results Section -->
    <v-row justify="center" v-else>
      <v-col cols="12" md="10">
        <v-card class="mb-6">
          <v-card-title class="text-h4">
            Accessibility Evaluation Results
          </v-card-title>
          <v-card-subtitle>{{ url }}</v-card-subtitle>
          
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-title class="text-h6">
                    Overall Score
                  </v-card-title>
                  <v-card-text class="text-center">
                    <v-progress-circular
                      :value="overallScore"
                      :color="getScoreColor(overallScore)"
                      size="150"
                      width="15"
                    >
                      <span class="text-h4">{{ overallScore }}%</span>
                    </v-progress-circular>
                    <div class="mt-4">
                      <v-chip
                        :color="getScoreColor(overallScore)"
                        text-color="white"
                        large
                      >
                        {{ getScoreLabel(overallScore) }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card outlined height="100%">
                  <v-card-title class="text-h6">
                    Principle Scores
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item
                        v-for="(principle, index) in wcagPrinciples"
                        :key="index"
                      >
                        <v-list-item-icon>
                          <v-icon :color="getScoreColor(principle.score)">
                            {{ principle.icon }}
                          </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{ principle.name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-chip
                            :color="getScoreColor(principle.score)"
                            text-color="white"
                          >
                            {{ principle.score }}%
                          </v-chip>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-6">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-title class="text-h6">
                    Recommendations
                  </v-card-title>
                  <v-card-text>
                    <v-timeline dense>
                      <v-timeline-item
                        v-for="(issue, index) in getHighPriorityIssues()"
                        :key="index"
                        color="red"
                        small
                      >
                        <div class="font-weight-bold">{{ issue.name }}</div>
                        <div class="text--secondary">{{ issue.recommendation }}</div>
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
              @click="evaluationComplete = false"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Back to Evaluation
            </v-btn>
            <v-spacer />
            <v-btn
              color="orange"
              dark
              @click="generateReport"
              :loading="generating"
            >
              Generate PDF Report
              <v-icon right>mdi-file-pdf-box</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Guide Dialog -->
    <v-dialog v-model="showGuide" max-width="600">
      <v-card>
        <v-card-title>
          {{ selectedCriterion?.name }}
        </v-card-title>
        <v-card-text>
          <div v-if="selectedCriterion">
            <p class="mb-4">{{ selectedCriterion.description }}</p>
            <v-divider class="mb-4" />
            <h3 class="mb-2">How to Test:</h3>
            <ul>
              <li
                v-for="(step, index) in selectedCriterion.testSteps"
                :key="index"
                class="mb-2"
              >
                {{ step }}
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="orange" text @click="showGuide = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { evaluationCriteria } from '@/utils/evaluationSys'

export default {
  name: 'WcagEvaluation',
  data: () => ({
    url: '',
    generating: false,
    showGuide: false,
    selectedCriterion: null,
    evaluationComplete: false,
    complianceOptions: [
      { text: 'Compliant', value: 100, icon: 'mdi-check-circle' },
      { text: 'Partially Compliant', value: 50, icon: 'mdi-alert-circle' },
      { text: 'Not Compliant', value: 0, icon: 'mdi-close-circle' },
      { text: 'Not Applicable', value: -1, icon: 'mdi-minus-circle' },
    ],
    wcagPrinciples: evaluationCriteria.principles.map(principle => ({
      ...principle,
      score: 0,
      criteria: principle.criteria.map(criterion => ({
        ...criterion,
        compliance: -1,
      })),
    })),
  }),
  computed: {
    evaluationProgress() {
      const total = this.getTotalCriteria()
      const evaluated = this.getEvaluatedCriteria()
      return Math.round((evaluated / total) * 100)
    },
    isEvaluationComplete() {
      return this.evaluationProgress === 100
    },
    overallScore() {
      const scores = this.wcagPrinciples.map(p => p.score)
      const validScores = scores.filter(score => score >= 0)
      if (validScores.length === 0) return 0
      return Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    },
  },
  methods: {
    getTotalCriteria() {
      return this.wcagPrinciples.reduce(
        (sum, principle) => sum + principle.criteria.length,
        0
      )
    },
    getEvaluatedCriteria() {
      return this.wcagPrinciples.reduce(
        (sum, principle) =>
          sum +
          principle.criteria.filter(c => c.compliance !== -1).length,
        0
      )
    },
    getScoreColor(score) {
      return evaluationCriteria.getScoreLevel(score).color
    },
    getScoreLabel(score) {
      return evaluationCriteria.getScoreLevel(score).label
    },
    getCriterionColor(compliance) {
      if (compliance === 100) return 'success'
      if (compliance === 50) return 'warning'
      if (compliance === 0) return 'error'
      return 'grey'
    },
    getCriterionIcon(compliance) {
      const option = this.complianceOptions.find(opt => opt.value === compliance)
      return option ? option.icon : 'mdi-minus-circle'
    },
    getHighPriorityIssues() {
      return evaluationCriteria.getPriorityIssues(this.wcagPrinciples)
    },
    finishEvaluation() {
      this.evaluationComplete = true
    },
    updateScores() {
      this.wcagPrinciples.forEach(principle => {
        principle.score = evaluationCriteria.calculateScore(principle)
      })
    },
    showGuideDialog(criterion) {
      this.selectedCriterion = criterion
      this.showGuide = true
    },
    async generateReport() {
      this.generating = true
      try {
        const recommendations = evaluationCriteria.generateRecommendations(this.wcagPrinciples)
        const reportData = {
          url: this.url,
          overallScore: this.overallScore,
          principles: this.wcagPrinciples,
          recommendations,
          timestamp: new Date().toISOString(),
        }
        await this.$store.dispatch('generateWcagReport', reportData)
        this.$toast.success('Report generated successfully')
      } catch (error) {
        this.$toast.error('Error generating report')
        console.error(error)
      } finally {
        this.generating = false
      }
    },
  },
  created() {
    this.url = this.$route.params.url
  },
}
</script>

<style scoped>
.v-chip {
  font-weight: 500;
}
</style> 