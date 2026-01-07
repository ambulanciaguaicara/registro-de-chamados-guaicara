import { db, collection, query, where, getDocs } from "../firebase.js";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function mountReports(el) {
  el.innerHTML = `
    <section class="reports-section">
      <h2>📊 Relatórios e Gráficos</h2>
      
      <div class="reports-controls">
        <label>
          Mês/Ano
          <input type="month" id="reportMonth" value="${getCurrentMonth()}">
        </label>
        <button id="btnGerarRelatorio" class="btn-add">📈 Gerar Gráfico</button>
        <button id="btnExportarPDF" class="btn-secondary" disabled>📄 Exportar PDF</button>
        <button id="btnImprimir" class="btn-outline" disabled>🖨️ Imprimir</button>
      </div>
      
      <div id="chartsContainer" class="charts-container hidden">
        <div class="chart-wrapper">
          <h3>Chamados por Prioridade</h3>
          <canvas id="chartPrioridade"></canvas>
        </div>
        <div class="chart-wrapper">
          <h3>Chamados por Destino</h3>
          <canvas id="chartDestino"></canvas>
        </div>
        <div class="chart-wrapper">
          <h3>Chamados por Finalidade</h3>
          <canvas id="chartFinalidade"></canvas>
        </div>
        <div class="chart-wrapper">
          <h3>Chamados por Período do Dia</h3>
          <canvas id="chartPeriodo"></canvas>
        </div>
      </div>
    </section>
  `;

  setupReportsEvents(el);
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function setupReportsEvents(root) {
  let charts = {};

  root.querySelector("#btnGerarRelatorio").addEventListener("click", async () => {
    const month = root.querySelector("#reportMonth").value;
    
    if (!month) {
      return alert("Selecione um mês");
    }

    try {
      const data = await fetchMonthData(month);
      
      // Destruir gráficos anteriores
      Object.values(charts).forEach(chart => chart.destroy());
      charts = {};

      // Criar novos gráficos
      charts.prioridade = createChart("chartPrioridade", "Prioridade", data.porPrioridade);
      charts.destino = createChart("chartDestino", "Destino", data.porDestino);
      charts.finalidade = createChart("chartFinalidade", "Finalidade", data.porFinalidade);
      charts.periodo = createChart("chartPeriodo", "Período", data.porPeriodo);

      root.querySelector("#chartsContainer").classList.remove("hidden");
      root.querySelector("#btnExportarPDF").disabled = false;
      root.querySelector("#btnImprimir").disabled = false;
    } catch (error) {
      alert("Erro ao gerar relatório: " + error.message);
    }
  });

  root.querySelector("#btnExportarPDF").addEventListener("click", async () => {
    const container = root.querySelector("#chartsContainer");
    
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`relatorio_${root.querySelector("#reportMonth").value}.pdf`);
    } catch (error) {
      alert("Erro ao exportar PDF: " + error.message);
    }
  });

  root.querySelector("#btnImprimir").addEventListener("click", () => {
    window.print();
  });
}

async function fetchMonthData(monthYear) {
  const [year, month] = monthYear.split("-");
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const callsRef = collection(db, "chamados");
  const q = query(
    callsRef,
    where("createdAt", ">=", startDate.toISOString()),
    where("createdAt", "<=", endDate.toISOString())
  );

  const snapshot = await getDocs(q);
  const calls = [];
  
  snapshot.forEach(doc => {
    calls.push(doc.data());
  });

  return {
    porPrioridade: aggregateBy(calls, "prioridade"),
    porDestino: aggregateBy(calls, "destino"),
    porFinalidade: aggregateBy(calls, "finalidade"),
    porPeriodo: aggregateByPeriod(calls)
  };
}

function aggregateBy(calls, field) {
  const counts = {};
  
  calls.forEach(call => {
    const value = call[field] || "Não informado";
    counts[value] = (counts[value] || 0) + 1;
  });

  return counts;
}

function aggregateByPeriod(calls) {
  const periods = { "Manhã (06-12h)": 0, "Tarde (12-18h)": 0, "Noite (18-06h)": 0 };
  
  calls.forEach(call => {
    if (!call.hora) return;
    
    const [hour] = call.hora.split(':');
    const hourNum = parseInt(hour, 10);
    
    if (hourNum >= 6 && hourNum < 12) {
      periods["Manhã (06-12h)"]++;
    } else if (hourNum >= 12 && hourNum < 18) {
      periods["Tarde (12-18h)"]++;
    } else {
      periods["Noite (18-06h)"]++;
    }
  });

  return periods;
}

function createChart(canvasId, label, data) {
  const ctx = document.getElementById(canvasId);
  
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: `Chamados por ${label}`,
        data: Object.values(data),
        backgroundColor: [
          "#CC0000",
          "#FF6B00",
          "#00A86B",
          "#0047AB",
          "#9C27B0",
          "#FFD700"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
