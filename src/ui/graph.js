// Módulo para exibir gráfico mensal e exportar PDF dos chamados
// Usa Chart.js para gráficos e jsPDF para PDF
import { watchCalls } from "../firebase.js";

let chartInstance = null;

export function mountGraph(el) {
  el.innerHTML = `
    <section>
      <h2>📈 Gráfico Mensal de Chamados</h2>
      <canvas id="chamadosChart" height="120"></canvas>
      <div style="margin-top: 16px;">
        <button id="btnExportPDF" class="btn-add">📄 Gerar PDF</button>
      </div>
    </section>
  `;

  // Carregar dados e renderizar gráfico
  watchCalls((snapshot) => {
    const data = [];
    snapshot.forEach(doc => data.push(doc.data()));
    renderChart(data);
  });

  // PDF
  el.querySelector('#btnExportPDF').onclick = () => exportPDF();
}

function renderChart(chamados) {
  const ctx = document.getElementById('chamadosChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  // Agrupar por mês, prioridade, destino, tipo
  const meses = Array.from({length:12}, (_,i) => (i+1).toString().padStart(2,'0'));
  const anoAtual = new Date().getFullYear();
  const porMes = {};
  meses.forEach(m => porMes[m] = {total:0, prioridade:{}, destino:{}, tipo:{}});
  chamados.forEach(c => {
    if (!c.dataHora) return;
    const d = new Date(c.dataHora);
    if (d.getFullYear() !== anoAtual) return;
    const mes = (d.getMonth()+1).toString().padStart(2,'0');
    porMes[mes].total++;
    porMes[mes].prioridade[c.prioridade] = (porMes[mes].prioridade[c.prioridade]||0)+1;
    porMes[mes].destino[c.destino] = (porMes[mes].destino[c.destino]||0)+1;
    porMes[mes].tipo[c.tipoChamado] = (porMes[mes].tipo[c.tipoChamado]||0)+1;
  });
  const labels = meses.map(m => `${m}/${anoAtual}`);
  const dataTotal = meses.map(m => porMes[m].total);

  chartInstance = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Chamados',
          data: dataTotal,
          backgroundColor: '#CC0000',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Chamados por mês' }
      }
    }
  });
}

function exportPDF() {
  const canvas = document.getElementById('chamadosChart');
  const imgData = canvas.toDataURL('image/png');
  const pdf = new window.jspdf.jsPDF();
  pdf.text('Gráfico Mensal de Chamados', 10, 10);
  pdf.addImage(imgData, 'PNG', 10, 20, 180, 80);
  pdf.save('grafico-chamados.pdf');
}
