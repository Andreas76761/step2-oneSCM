// Klickstrecke als BPMN 2.0 (ADR-106, W-07): Start → je Station eine Aufgabe → Ende; parallele Wege einer Station
// (3a, 3b …) sind Alternativen zwischen einem exklusiven Gateway und seiner Zusammenführung. Mit Diagramm (BPMN DI),
// damit Modellierungswerkzeuge wie Camunda Modeler oder bpmn.io die Strecke ohne Nacharbeit anzeigen.
import { stationLabels, type ClickStation } from './clickpath.js';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TASK_W = 120;
const TASK_H = 70;
const GAP = 50;
const ROW = 100;
const GW = 50;
const EV = 36;

export function clickpathBpmn(title: string, stations: ClickStation[], id = 'Klickstrecke') {
  const labels = stationLabels(stations);
  const maxAlt = Math.max(1, ...stations.map((s) => s.alternatives.length));
  const mid = 60 + ((maxAlt - 1) * ROW) / 2 + TASK_H / 2;
  const nodes: string[] = [];
  const flows: string[] = [];
  const shapes: string[] = [];
  const edges: string[] = [];
  let x = 40;
  let n = 0;
  const flow = (from: { id: string; x: number; y: number }, to: { id: string; x: number; y: number }) => {
    const fid = `Flow_${++n}`;
    flows.push(`<bpmn:sequenceFlow id="${fid}" sourceRef="${from.id}" targetRef="${to.id}"/>`);
    edges.push(`<bpmndi:BPMNEdge id="${fid}_di" bpmnElement="${fid}"><di:waypoint x="${from.x}" y="${from.y}"/>${from.y !== to.y ? `<di:waypoint x="${from.x}" y="${to.y}"/>` : ''}<di:waypoint x="${to.x}" y="${to.y}"/></bpmndi:BPMNEdge>`);
    return fid;
  };
  // Ein- und ausgehende Flüsse je Knoten (für incoming/outgoing)
  const io = new Map<string, { inc: string[]; out: string[] }>();
  const link = (from: { id: string; x: number; y: number }, to: { id: string; x: number; y: number }) => {
    const fid = flow(from, to);
    (io.get(from.id) ?? io.set(from.id, { inc: [], out: [] }).get(from.id)!).out.push(fid);
    (io.get(to.id) ?? io.set(to.id, { inc: [], out: [] }).get(to.id)!).inc.push(fid);
  };
  const start = { id: 'Start', x: x + EV, y: mid };
  shapes.push(`<bpmndi:BPMNShape id="Start_di" bpmnElement="Start"><dc:Bounds x="${x}" y="${mid - EV / 2}" width="${EV}" height="${EV}"/></bpmndi:BPMNShape>`);
  x += EV + GAP;
  let prev = start;
  const pending: { id: string; kind: 'task' | 'split' | 'join'; name: string }[] = [];
  stations.forEach((s, i) => {
    if (s.alternatives.length === 1) {
      const tid = `Task_${i + 1}`;
      const name = `${labels[i][0]} ${s.alternatives[0].caption}`.trim();
      pending.push({ id: tid, kind: 'task', name });
      shapes.push(`<bpmndi:BPMNShape id="${tid}_di" bpmnElement="${tid}"><dc:Bounds x="${x}" y="${mid - TASK_H / 2}" width="${TASK_W}" height="${TASK_H}"/></bpmndi:BPMNShape>`);
      link(prev, { id: tid, x, y: mid });
      prev = { id: tid, x: x + TASK_W, y: mid };
      x += TASK_W + GAP;
      return;
    }
    const split = `Gateway_${i + 1}_auswahl`;
    const join = `Gateway_${i + 1}_weiter`;
    pending.push({ id: split, kind: 'split', name: `Weg ${labels[i].join(' oder ')}` });
    shapes.push(`<bpmndi:BPMNShape id="${split}_di" bpmnElement="${split}" isMarkerVisible="true"><dc:Bounds x="${x}" y="${mid - GW / 2}" width="${GW}" height="${GW}"/></bpmndi:BPMNShape>`);
    link(prev, { id: split, x, y: mid });
    const sx = x + GW;
    x += GW + GAP;
    const top = mid - ((s.alternatives.length - 1) * ROW) / 2;
    const ends: { id: string; x: number; y: number }[] = [];
    s.alternatives.forEach((a, k) => {
      const tid = `Task_${i + 1}${String.fromCharCode(97 + k)}`;
      const y = top + k * ROW;
      pending.push({ id: tid, kind: 'task', name: `${labels[i][k]} ${a.caption}`.trim() });
      shapes.push(`<bpmndi:BPMNShape id="${tid}_di" bpmnElement="${tid}"><dc:Bounds x="${x}" y="${y - TASK_H / 2}" width="${TASK_W}" height="${TASK_H}"/></bpmndi:BPMNShape>`);
      link({ id: split, x: sx - GW / 2, y: mid }, { id: tid, x, y });
      ends.push({ id: tid, x: x + TASK_W, y });
    });
    x += TASK_W + GAP;
    pending.push({ id: join, kind: 'join', name: '' });
    shapes.push(`<bpmndi:BPMNShape id="${join}_di" bpmnElement="${join}" isMarkerVisible="true"><dc:Bounds x="${x}" y="${mid - GW / 2}" width="${GW}" height="${GW}"/></bpmndi:BPMNShape>`);
    for (const e of ends) link(e, { id: join, x: x + GW / 2, y: mid });
    prev = { id: join, x: x + GW, y: mid };
    x += GW + GAP;
  });
  shapes.push(`<bpmndi:BPMNShape id="Ende_di" bpmnElement="Ende"><dc:Bounds x="${x}" y="${mid - EV / 2}" width="${EV}" height="${EV}"/></bpmndi:BPMNShape>`);
  link(prev, { id: 'Ende', x, y: mid });
  const refs = (nid: string) => (io.get(nid)?.inc ?? []).map((f) => `<bpmn:incoming>${f}</bpmn:incoming>`).join('') + (io.get(nid)?.out ?? []).map((f) => `<bpmn:outgoing>${f}</bpmn:outgoing>`).join('');
  nodes.push(`<bpmn:startEvent id="Start" name="Start">${refs('Start')}</bpmn:startEvent>`);
  for (const p of pending) {
    const tag = p.kind === 'task' ? 'bpmn:userTask' : 'bpmn:exclusiveGateway';
    nodes.push(`<${tag} id="${p.id}"${p.name ? ` name="${esc(p.name)}"` : ''}>${refs(p.id)}</${tag}>`);
  }
  nodes.push(`<bpmn:endEvent id="Ende" name="Ende">${refs('Ende')}</bpmn:endEvent>`);
  const pid = id.replace(/[^A-Za-z0-9_]/g, '_').replace(/^(?=\d)/, '_');
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_${pid}" targetNamespace="https://onescm.example/handbook/clickpath" exporter="oneSCM Handbook Studio" exporterVersion="1">
  <bpmn:process id="Process_${pid}" name="${esc(title)}" isExecutable="false">
    ${[...nodes, ...flows].join('\n    ')}
  </bpmn:process>
  <bpmndi:BPMNDiagram id="Diagram_${pid}">
    <bpmndi:BPMNPlane id="Plane_${pid}" bpmnElement="Process_${pid}">
      ${[...shapes, ...edges].join('\n      ')}
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
}
