<template>
  <div class="outermost">
    <v-col cols="12">
      <v-row justify="center">
        <p class="titles ma-16">
          What kind of test are you looking to start?
        </p>
      </v-row>
    </v-col>

    <v-col cols="12" class="mt-6">
      <v-row>
        <v-col cols="10" md="4" sm="10" class="card">
          <CardTypeTest
            :img="require('../../../public/specialist.png')"
            title="Usability Heuristic"
            type="Test"
            segund-type="HEURISTICS"
            :texts="['Usability Percentage', 'Final Report PDF', 'Invite specialists to evaluate your application']"
            @click="setTestType"
          />
        </v-col>

        <v-col cols="12" md="4" sm="10" class="card">
          <CardTypeTest
            :img="require('../../../public/user.png')"
            title="Usability User"
            type="Test"
            segund-type="User"
            :texts="['Webcam, audio & screen record', 'Enhanced answer analysis', 'Moderated or non moderated tests']"
            @click="setTestType"
          />
        </v-col>

        <v-col cols="12" md="4" sm="10" class="card">
          <v-card class="mx-auto pa-6" @click="showWcagDialog = true">
            <v-card-title class="justify-center">
              <v-icon size="64" color="orange">
                mdi-access-point
              </v-icon>
            </v-card-title>
            <v-card-title class="justify-center">
              WCAG Evaluation
            </v-card-title>
            <v-card-text>
              <div class="text-center">
                <p>WCAG 2.0/2.1/2.2 Compliance</p>
                <p>Accessibility Score</p>
                <p>Detailed Evaluation Report</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <!-- WCAG URL Input Dialog -->
    <v-dialog v-model="showWcagDialog" max-width="600px">
      <v-card class="pa-6">
        <v-card-title class="text-h5 mb-4">
          Enter Website URL for WCAG Evaluation
        </v-card-title>
        
        <v-text-field
          v-model="wcagUrl"
          label="Website URL"
          placeholder="https://example.com"
          :rules="urlRules"
          outlined
          clearable
          @keyup.enter="startWcagEvaluation"
        />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey darken-1"
            text
            @click="showWcagDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="orange"
            dark
            :disabled="!isValidUrl"
            @click="startWcagEvaluation"
          >
            Start Evaluation
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- After the WCAG URL Input Dialog -->
    <v-dialog
      v-model="showLoadingScreen"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="fill-height">
        <WcagLoadingScreen
          :url="wcagUrl"
          @analysis-complete="handleAnalysisComplete"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CardTypeTest from '@/components/atoms/CardTypeTest.vue'
import WcagLoadingScreen from '@/components/organisms/WcagLoadingScreen.vue'

export default {
  name: 'CreateBlankView',
  components: {
    CardTypeTest,
    WcagLoadingScreen,
  },
  data: () => ({
    showWcagDialog: false,
    showLoadingScreen: false,
    wcagUrl: '',
    urlRules: [
      (v) => !!v || 'URL is required',
      (v) => /^(http|https):\/\/[^ "]+$/.test(v) || 'URL must be valid',
    ],
  }),
  computed: {
    isValidUrl() {
      return this.wcagUrl && /^(http|https):\/\/[^ "]+$/.test(this.wcagUrl)
    },
  },
  methods: {
    setTestType(type, segundType) {
      this.$store.commit('Tests/SET_TEST_TYPE', segundType)
      this.$router.push('/create/name')
    },
    startWcagEvaluation() {
      if (this.isValidUrl) {
        this.showWcagDialog = false
        this.showLoadingScreen = true
      }
    },
    handleAnalysisComplete() {
      this.$router.push({
        name: 'WcagEvaluation',
        params: { url: this.wcagUrl },
      })
    },
  },
}
</script>

<style scoped>
.card {
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.titles {
  font-size: 24px;
  font-weight: 500;
  color: #252525;
}

.v-card {
  height: 100%;
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style>