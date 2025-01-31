<template>
  <div>
    <h1>Analysis Results</h1>
    <div v-if="results">
      <h2>URL: {{ results.url }}</h2>
      <p>Timestamp: {{ results.timestamp }}</p>
      <h3>Elements Found</h3>
      <ul>
        <li>Images: {{ results.elements.byType.images }}</li>
        <li>Headings: {{ results.elements.byType.headings }}</li>
        <li>Forms: {{ results.elements.byType.forms }}</li>
        <li>Links: {{ results.elements.byType.links }}</li>
      </ul>
      <h3>Issues Found</h3>
      <p>Total Issues: {{ results.issues.total }}</p>
      <ul>
        <li v-for="issue in results.issues.details" :key="issue.code">
          {{ issue.message }} (Element: {{ issue.element }})
        </li>
      </ul>
      <h3>Score: {{ results.score }}</h3>
    </div>
    <div v-else>
      <p>No results available.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    results: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style> 