/* app.js — all interactivity. Progress is saved in your browser (localStorage). */
(() => {
  "use strict";

  const KEY = "tj43.v1";
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const ORDER = [1, 2, 3, 4, 5, 6, 0];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- helpers ---------- */
  const fmtDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  const isoDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const startOfToday = () => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  };
  const plusDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const fmtFeet = (feet) => {
    const totalIn = Math.round(feet * 12 * 4) / 4;
    const ft = Math.floor(totalIn / 12);
    const inch = totalIn - ft * 12;
    return `${ft}' ${inch}"`;
  };
  const ckey = (wid, dow, i) => `${wid}|${dow}|${i}`;
  const parseIso = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  // The goal distance is editable. state.goal (feet) overrides the default GOAL_FEET from plan.js.
  const goalFeet = () => (typeof state.goal === "number" && state.goal >= 15 && state.goal < 60 ? state.goal : GOAL_FEET);
  const splitFeet = (feet) => {
    const t = Math.round(feet * 12 * 4) / 4;
    const ft = Math.floor(t / 12);
    return { ft, inch: t - ft * 12 };
  };
  const fmtGoal = (g = goalFeet()) => {
    const { ft, inch } = splitFeet(g);
    return inch ? `${ft}' ${inch}"` : `${ft}'`;
  };
  const goalTitle = () => {
    const { ft, inch } = splitFeet(goalFeet());
    return inch ? fmtGoal() : `${ft}-Foot`;
  };
  // Plan text can use {goal} {hop} {step} {jump} {hopstep}; they scale with your goal (35% / 30% / 35%).
  function fillGoal(s) {
    if (typeof s !== "string" || !s.includes("{")) return s;
    const g = goalFeet();
    const vals = {
      goal: fmtGoal(g),
      hop: Math.round(g * 0.35),
      step: Math.round(g * 0.3),
      jump: Math.round(g * 0.35),
      hopstep: Math.round(g * 0.65),
    };
    return s.replace(/\{(goal|hop|step|jump|hopstep)\}/g, (_, k) => vals[k]);
  }

  // state.skips holds meet days: { "2026-12-05": true }
  const meetDates = () =>
    Object.keys(state.skips)
      .filter((k) => state.skips[k])
      .sort();
  function nextMeet(today) {
    const ds = meetDates().filter((k) => parseIso(k) >= today);
    return ds.length ? parseIso(ds[0]) : null;
  }
  function meetWarning(date) {
    if (state.skips[isoDate(plusDays(date, 1))])
      return "Meet tomorrow: keep today light. Cut sets in half and skip heavy leg work.";
    if (state.skips[isoDate(plusDays(date, 2))])
      return "Meet in 2 days: no heavy squats or deadlifts today. Keep your legs fresh.";
    return "";
  }

  function el(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      e.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return e;
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- state ---------- */
  const blank = () => ({ checks: {}, logs: {}, notes: {}, jumps: [], skips: {} });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") return Object.assign(blank(), s);
    } catch (e) {
      /* ignore */
    }
    return blank();
  }
  let state = load();
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      toast("Could not save. Is your browser blocking storage?");
    }
  }

  /* ---------- week lookup ---------- */
  function findWeekIdx(today) {
    for (let i = 0; i < WEEKS.length; i++) {
      const s = WEEKS[i].start;
      if (today >= s && today < plusDays(s, WEEKS[i].len || 7)) return i;
    }
    return today < WEEKS[0].start ? 0 : WEEKS.length - 1;
  }
  const realWeekIdx = () => findWeekIdx(startOfToday());

  function weekStats(w) {
    let done = 0,
      total = 0;
    (w.order || ORDER).forEach((dow, di) => {
      if (state.skips[isoDate(plusDays(w.start, di))]) return; // meet day: workout skipped
      dayFor(w, dow).ex.forEach((_, i) => {
        total++;
        if (state.checks[ckey(w.id, dow, i)]) done++;
      });
    });
    return { done, total };
  }

  /* ---------- header ---------- */
  function updateHeader() {
    const heading = document.getElementById("appTitle");
    if (heading) heading.textContent = `👟 Triple Jump ${goalTitle()} Tracker`;
    document.title = `Triple Jump ${goalTitle()} Tracker`;
    const today = startOfToday();
    const [y, m, d] = WINTER_START.split("-").map(Number);
    const days = Math.round((new Date(y, m - 1, d) - today) / 86400000);
    const last = WEEKS[WEEKS.length - 1];
    const status = document.getElementById("status");
    if (days > 0) {
      status.textContent = `Winter season starts in ${days} day${days === 1 ? "" : "s"} (Nov 20)`;
    } else if (today >= plusDays(last.start, 7)) {
      status.textContent = "Season complete. Nice work!";
    } else {
      const w = WEEKS[realWeekIdx()];
      status.textContent = `${w.label} · ${PHASES[w.phase].name}`;
    }
    const nm = nextMeet(today);
    if (nm) status.textContent += ` · Next meet: ${fmtDate(nm)}`;
    const best = state.jumps.reduce((m, j) => Math.max(m, j.feet), 0);
    const fill = document.getElementById("goalFill");
    const text = document.getElementById("goalText");
    if (!best) {
      fill.style.width = "0%";
      text.textContent = `Goal: ${fmtGoal()} · No jumps logged yet`;
    } else {
      fill.style.width = Math.min(100, (best / goalFeet()) * 100) + "%";
      const left = goalFeet() - best;
      text.textContent =
        `Best: ${fmtFeet(best)} · Goal: ${fmtGoal()} · ` + (left > 0 ? `${fmtFeet(left)} to go` : "GOAL REACHED! 🎉");
    }
  }

  /* ---------- training view ---------- */
  const app = document.getElementById("app");
  let view = "week";
  let weekIdx = realWeekIdx();
  let counters = [];
  let weekBar = null;

  function refreshCounts() {
    counters.forEach((c) => {
      if (state.skips[c.iso]) {
        c.node.textContent = "🏁 Meet";
        c.node.classList.remove("all");
        return;
      }
      const day = dayFor(c.w, c.dow);
      let d = 0;
      day.ex.forEach((_, i) => {
        if (state.checks[ckey(c.w.id, c.dow, i)]) d++;
      });
      c.node.textContent = c.total ? `${d}/${c.total}` : "";
      c.node.classList.toggle("all", c.total > 0 && d === c.total);
    });
    if (weekBar) {
      const s = weekStats(WEEKS[weekIdx]);
      const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
      weekBar.fill.style.width = pct + "%";
      weekBar.label.textContent = `${s.done}/${s.total} done · ${pct}%`;
    }
  }

  function chips() {
    const real = realWeekIdx();
    const wrap = el("div", { class: "chips", "aria-label": "Choose a week" });
    WEEKS.forEach((w, i) => {
      wrap.append(
        el("button", {
          class: `chip ph-${w.phase}` + (i === real ? " thisweek" : ""),
          "aria-current": i === weekIdx ? "true" : "false",
          title: `${w.label}: ${fmtDate(w.start)}`,
          text: w.short,
          onclick: () => {
            weekIdx = i;
            renderWeek();
          },
        })
      );
    });
    return wrap;
  }

  function weekHeader(w) {
    const ph = PHASES[w.phase];
    const end = plusDays(w.start, (w.len || 7) - 1);
    const seasonLabel =
      ph.season === "ramp" ? "Ramp-up" : ph.season === "winter" ? "Winter · weight room focus" : "Spring · technique & drills";
    const fill = el("div", { class: "fill" });
    const label = el("div", { class: "barlabel" });
    weekBar = { fill, label };
    const actions = el("div", { class: "actions" });
    if (weekIdx !== realWeekIdx()) {
      actions.append(
        el("button", {
          class: "btn primary",
          text: "Go to this week",
          onclick: () => {
            weekIdx = realWeekIdx();
            renderWeek();
          },
        })
      );
    }
    actions.append(
      el("button", {
        class: "btn",
        text: "Expand all",
        onclick: () => app.querySelectorAll("details.day").forEach((d) => (d.open = true)),
      }),
      el("button", {
        class: "btn",
        text: "Collapse all",
        onclick: () => app.querySelectorAll("details.day").forEach((d) => (d.open = false)),
      })
    );
    return el(
      "section",
      { class: `weekhead ph-${w.phase}` },
      el(
        "div",
        { class: "wh-top" },
        el(
          "div",
          {},
          el("h2", { text: `${w.label} · ${ph.name}` }),
          el("p", { class: "muted", text: `${fmtDate(w.start)} – ${fmtDate(end)} · ${seasonLabel}` })
        ),
        actions
      ),
      el("p", { text: fillGoal(ph.blurb) }),
      WEEK_NOTES[w.id] ? el("p", { class: "wnote", text: WEEK_NOTES[w.id] }) : null,
      el("div", { class: "bar" }, fill),
      label
    );
  }

  function exRow(w, dow, idx, e) {
    const id = ckey(w.id, dow, idx);
    const cb = el("input", { type: "checkbox" });
    cb.checked = !!state.checks[id];
    const li = el("li", { class: cb.checked ? "done" : "" });
    cb.addEventListener("change", () => {
      if (cb.checked) state.checks[id] = true;
      else delete state.checks[id];
      li.classList.toggle("done", cb.checked);
      save();
      refreshCounts();
    });
    const log = el("input", {
      type: "text",
      class: "log",
      placeholder: "Weight / reps / time (optional)",
      maxlength: "60",
      "aria-label": `Log for ${e.n}`,
    });
    log.value = state.logs[id] || "";
    log.addEventListener("input", () => {
      if (log.value) state.logs[id] = log.value;
      else delete state.logs[id];
      save();
    });
    li.append(
      el(
        "label",
        {},
        cb,
        el("span", {}, el("span", { class: "name", text: fillGoal(e.n) }), el("br"), el("span", { class: "detail", text: fillGoal(e.d) }))
      ),
      log
    );
    return li;
  }

  function dayCard(w, dow, i, today) {
    const day = dayFor(w, dow);
    const date = plusDays(w.start, i);
    const iso = isoDate(date);
    const isToday = iso === isoDate(today);
    const skipped = !!state.skips[iso];
    const count = el("span", { class: "count" });
    const d = el("details", { class: `day tag-${day.tag}` + (isToday ? " today" : "") + (skipped ? " skipped" : "") });
    if (isToday) d.open = true;
    d.append(
      el(
        "summary",
        {},
        el(
          "div",
          { class: "s-main" },
          el("strong", { text: DAY_NAMES[dow] }),
          el("span", { class: "date", text: fmtDate(date) }),
          isToday ? el("span", { class: "badge", text: "Today" }) : null
        ),
        el("div", { class: "s-title", text: skipped ? "Meet day: workout skipped" : day.title }),
        count
      )
    );
    const body = el("div", { class: "day-body" });
    if (skipped) {
      body.append(
        el("p", {
          class: "note",
          text: "Meet day. This workout is skipped and does not count against your week. Log your result in the Progress tab.",
        })
      );
    } else {
      const warn = meetWarning(date);
      if (warn && day.ex.length) body.append(el("p", { class: "note warn", text: warn }));
      if (day.note) body.append(el("p", { class: "note", text: fillGoal(day.note) }));
      if (day.ex.length) {
        const list = el("ul", { class: "ex" });
        day.ex.forEach((e, idx) => list.append(exRow(w, dow, idx, e)));
        body.append(list);
      }
    }
    body.append(
      el("button", {
        class: "btn skipbtn",
        text: skipped ? "Undo meet day (do this workout)" : "🏁 Meet day: skip this workout",
        onclick: () => toggleMeet(iso),
      })
    );
    const nk = `${w.id}|${dow}`;
    const ta = el("textarea", {
      class: "daynote",
      rows: "2",
      maxlength: "500",
      placeholder: "Notes: times, distances, how it felt…",
      "aria-label": `Notes for ${DAY_NAMES[dow]}`,
    });
    ta.value = state.notes[nk] || "";
    ta.addEventListener("input", () => {
      if (ta.value) state.notes[nk] = ta.value;
      else delete state.notes[nk];
      save();
    });
    body.append(ta);
    d.append(body);
    counters.push({ w, dow, iso, node: count, total: day.ex.length });
    return d;
  }

  function renderWeek() {
    counters = [];
    weekBar = null;
    const w = WEEKS[weekIdx];
    const today = startOfToday();
    const nodes = [chips(), weekHeader(w)];
    (w.order || ORDER).forEach((dow, i) => nodes.push(dayCard(w, dow, i, today)));
    app.replaceChildren(...nodes);
    refreshCounts();
    const cur = app.querySelector(".chip[aria-current='true']");
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ inline: "center", block: "nearest" });
  }

  function toggleMeet(iso) {
    const open = [...app.querySelectorAll("details.day")].map((d) => d.open);
    const y = window.scrollY;
    if (state.skips[iso]) delete state.skips[iso];
    else state.skips[iso] = true;
    save();
    updateHeader();
    if (view === "week") {
      renderWeek();
      app.querySelectorAll("details.day").forEach((d, i) => {
        if (open[i] != null) d.open = open[i];
      });
      window.scrollTo({ top: y });
    } else {
      renderProgress();
    }
    toast(state.skips[iso] ? "Marked as a meet day." : "Meet day removed.");
  }

  /* ---------- progress view ---------- */
  const NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs = {}, text) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (text != null) n.textContent = text;
    return n;
  }

  function chart() {
    const js = [...state.jumps].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id));
    if (!js.length) return el("p", { class: "muted", text: "Log a jump to see your chart." });
    const W = 640,
      H = 260,
      L = 46,
      R = 16,
      T = 16,
      B = 30;
    const vals = js.map((j) => j.feet);
    const lo = Math.floor(Math.min(...vals, goalFeet() - 6)) - 1;
    const hi = Math.ceil(Math.max(...vals, goalFeet())) + 1;
    const x = (i) => L + (js.length === 1 ? 0.5 : i / (js.length - 1)) * (W - L - R);
    const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart", role: "img", "aria-label": "Jump distance over time" });
    const step = hi - lo > 14 ? 4 : 2;
    for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
      svg.append(svgEl("line", { class: "grid", x1: L, x2: W - R, y1: y(v), y2: y(v) }));
      svg.append(svgEl("text", { x: L - 6, y: y(v) + 4, "text-anchor": "end" }, `${v}'`));
    }
    svg.append(svgEl("line", { class: "goal", x1: L, x2: W - R, y1: y(goalFeet()), y2: y(goalFeet()) }));
    svg.append(svgEl("text", { x: W - R, y: y(goalFeet()) - 5, "text-anchor": "end" }, `Goal ${fmtGoal()}`));
    if (js.length > 1) {
      svg.append(svgEl("polyline", { class: "line", points: js.map((j, i) => `${x(i)},${y(j.feet)}`).join(" ") }));
    }
    js.forEach((j, i) => {
      const c = svgEl("circle", { class: "pt", cx: x(i), cy: y(j.feet), r: 5 });
      c.append(svgEl("title", {}, `${j.date}: ${fmtFeet(j.feet)}`));
      svg.append(c);
    });
    svg.append(svgEl("text", { x: x(0), y: H - 8, "text-anchor": js.length === 1 ? "middle" : "start" }, js[0].date));
    if (js.length > 1) svg.append(svgEl("text", { x: x(js.length - 1), y: H - 8, "text-anchor": "end" }, js[js.length - 1].date));
    return svg;
  }

  function jumpForm() {
    const date = el("input", { type: "date", required: true, value: isoDate(startOfToday()) });
    const ft = el("input", { type: "number", min: "0", max: "60", step: "1", placeholder: "ft", required: true, inputmode: "numeric" });
    const inch = el("input", { type: "number", min: "0", max: "11.75", step: "0.25", placeholder: "in", inputmode: "decimal" });
    const type = el("select", {}, el("option", { value: "Practice", text: "Practice" }), el("option", { value: "Meet", text: "Meet" }));
    const note = el("input", { type: "text", maxlength: "80", placeholder: "Hop / step / jump, wind, notes…" });
    const field = (label, input, cls = "") => el("div", { class: "field " + cls }, el("label", { text: label }), input);
    const form = el(
      "form",
      { class: "form" },
      field("Date", date),
      field("Feet", ft),
      field("Inches", inch),
      field("Type", type),
      field("Note (optional)", note, "wide"),
      el("button", { class: "btn primary", type: "submit", text: "Add jump" })
    );
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const feet = Number(ft.value) + (Number(inch.value) || 0) / 12;
      if (!(feet > 0 && feet < 60) || !date.value) {
        toast("Enter a valid date and distance.");
        return;
      }
      state.jumps.push({ id: Date.now(), date: date.value, feet, type: type.value, note: note.value.trim() });
      save();
      toast(`Logged ${fmtFeet(feet)}`);
      updateHeader();
      renderProgress();
    });
    return form;
  }

  function history() {
    const js = [...state.jumps].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
    if (!js.length) return el("p", { class: "muted", text: "No jumps logged yet." });
    const ul = el("ul", { class: "hist" });
    const best = Math.max(...js.map((j) => j.feet));
    js.forEach((j) => {
      ul.append(
        el(
          "li",
          {},
          el(
            "div",
            {},
            el("strong", { text: fmtFeet(j.feet) + (j.feet === best ? " 🏆" : "") }),
            el("div", { class: "small", text: `${j.date} · ${j.type}${j.note ? " · " + j.note : ""}` })
          ),
          el("button", {
            class: "btn danger",
            text: "Delete",
            "aria-label": `Delete jump ${fmtFeet(j.feet)} on ${j.date}`,
            onclick: () => {
              if (!confirm("Delete this jump?")) return;
              state.jumps = state.jumps.filter((x) => x.id !== j.id);
              save();
              updateHeader();
              renderProgress();
            },
          })
        )
      );
    });
    return ul;
  }

  function goalCard() {
    const cur = splitFeet(goalFeet());
    const ft = el("input", { type: "number", min: "15", max: "59", step: "1", required: true, inputmode: "numeric", value: String(cur.ft) });
    const inch = el("input", { type: "number", min: "0", max: "11.75", step: "0.25", inputmode: "decimal", value: String(cur.inch) });
    const field = (label, input) => el("div", { class: "field" }, el("label", { text: label }), input);
    const form = el(
      "form",
      { class: "form" },
      field("Feet", ft),
      field("Inches", inch),
      el("button", { class: "btn primary", type: "submit", text: "Save goal" }),
      el("button", {
        class: "btn",
        type: "button",
        text: `Reset to ${fmtGoal(GOAL_FEET)}`,
        onclick: () => {
          delete state.goal;
          save();
          updateHeader();
          renderProgress();
          toast("Goal reset.");
        },
      })
    );
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const feet = Number(ft.value) + (Number(inch.value) || 0) / 12;
      if (!(feet >= 15 && feet < 60)) {
        toast("Enter a goal between 15 and 60 feet.");
        return;
      }
      state.goal = feet;
      save();
      updateHeader();
      renderProgress();
      toast(`Goal set to ${fmtGoal(feet)}`);
    });
    return el(
      "section",
      { class: "card" },
      el("h2", { text: "Goal distance" }),
      el("p", {
        class: "muted",
        text: "Change your target any time. The progress bar, chart and the hop / step / jump targets all update.",
      }),
      form
    );
  }

  function meetsCard() {
    const date = el("input", { type: "date" });
    const add = () => {
      if (!date.value) {
        toast("Pick a meet date first.");
        return;
      }
      state.skips[date.value] = true;
      save();
      updateHeader();
      renderProgress();
      toast("Meet added.");
    };
    const dates = meetDates();
    const list = dates.length
      ? el(
          "ul",
          { class: "hist" },
          dates.map((k) =>
            el(
              "li",
              {},
              el(
                "div",
                {},
                el("strong", { text: `${DAY_NAMES[parseIso(k).getDay()]}, ${fmtDate(parseIso(k))}` }),
                el("div", { class: "small", text: k })
              ),
              el("button", {
                class: "btn danger",
                text: "Remove",
                "aria-label": `Remove meet on ${k}`,
                onclick: () => {
                  delete state.skips[k];
                  save();
                  updateHeader();
                  renderProgress();
                },
              })
            )
          )
        )
      : el("p", { class: "muted", text: "No meets added yet. Add a date when you get your schedule." });
    return el(
      "section",
      { class: "card" },
      el("h2", { text: "Meet schedule" }),
      el("p", {
        class: "muted",
        text: "A meet day skips that day's workout and adds a light-day reminder on the 1–2 days before it. You can also tap the meet button on any day in the Training tab.",
      }),
      el(
        "div",
        { class: "form" },
        el("div", { class: "field" }, el("label", { text: "Meet date" }), date),
        el("button", { class: "btn primary", text: "Add meet", onclick: add })
      ),
      list
    );
  }

  function weekCompletion() {
    const box = el("div", {});
    WEEKS.forEach((w, i) => {
      const s = weekStats(w);
      const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
      const fill = el("div", { class: "fill" });
      fill.style.width = pct + "%";
      box.append(
        el(
          "div",
          { class: "wk" },
          el("button", {
            class: "btn",
            text: w.short,
            "aria-label": `Open ${w.label}`,
            onclick: () => {
              weekIdx = i;
              setView("week");
            },
          }),
          el("div", { class: "bar" }, fill),
          el("span", { class: "pct", text: pct + "%" })
        )
      );
    });
    return box;
  }

  function download(name, text) {
    const a = el("a", { href: URL.createObjectURL(new Blob([text], { type: "application/json" })), download: name });
    document.body.append(a);
    a.click();
    a.remove();
  }

  function backup() {
    const file = el("input", { type: "file", accept: "application/json,.json", hidden: true });
    file.addEventListener("change", () => {
      const f = file.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("bad");
          if (!confirm("Replace your current progress with this backup?")) return;
          state = Object.assign(blank(), {
            checks: data.checks && typeof data.checks === "object" ? data.checks : {},
            logs: data.logs && typeof data.logs === "object" ? data.logs : {},
            notes: data.notes && typeof data.notes === "object" ? data.notes : {},
            skips: data.skips && typeof data.skips === "object" ? data.skips : {},
            goal: typeof data.goal === "number" && data.goal >= 15 && data.goal < 60 ? data.goal : undefined,
            jumps: Array.isArray(data.jumps) ? data.jumps.filter((j) => j && typeof j.feet === "number" && typeof j.date === "string") : [],
          });
          save();
          updateHeader();
          renderProgress();
          toast("Backup restored.");
        } catch (e) {
          toast("That file is not a valid backup.");
        }
      };
      r.readAsText(f);
    });
    return el(
      "div",
      { class: "actions" },
      el("button", {
        class: "btn primary",
        text: "Export backup",
        onclick: () => download(`tj43-backup-${isoDate(startOfToday())}.json`, JSON.stringify(state, null, 2)),
      }),
      el("button", { class: "btn", text: "Import backup", onclick: () => file.click() }),
      el("button", {
        class: "btn danger",
        text: "Reset everything",
        onclick: () => {
          if (!confirm("Erase ALL progress, logs and jumps on this device? This cannot be undone.")) return;
          state = blank();
          save();
          updateHeader();
          renderProgress();
        },
      }),
      file
    );
  }

  function renderProgress() {
    const js = state.jumps;
    const best = js.reduce((m, j) => Math.max(m, j.feet), 0);
    const latest = [...js].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    const stat = (v, l) => el("div", { class: "stat" }, el("b", { text: v }), el("span", { text: l }));
    app.replaceChildren(
      el(
        "section",
        { class: "card" },
        el("h2", { text: "Your jumps" }),
        el(
          "div",
          { class: "stats" },
          stat(best ? fmtFeet(best) : "—", "Personal best"),
          stat(latest ? fmtFeet(latest.feet) : "—", "Latest"),
          stat(best ? (best >= goalFeet() ? "Goal hit! 🎉" : fmtFeet(goalFeet() - best)) : "—", `To go to ${fmtGoal()}`),
          stat(String(js.length), "Jumps logged")
        )
      ),
      goalCard(),
      el("section", { class: "card" }, el("h2", { text: "Distance over time" }), chart()),
      el("section", { class: "card" }, el("h2", { text: "Log a jump" }), jumpForm()),
      meetsCard(),
      el("section", { class: "card" }, el("h2", { text: "History" }), history()),
      el("section", { class: "card" }, el("h2", { text: "Workout completion by week" }), weekCompletion()),
      el(
        "section",
        { class: "card" },
        el("h2", { text: "Backup" }),
        el("p", {
          class: "muted",
          text: "Progress is saved in this browser only. Export a backup to move it to another device or keep it safe.",
        }),
        backup()
      )
    );
  }

  /* ---------- tabs ---------- */
  function setView(v) {
    view = v;
    document.getElementById("tab-week").setAttribute("aria-current", v === "week" ? "page" : "false");
    document.getElementById("tab-progress").setAttribute("aria-current", v === "progress" ? "page" : "false");
    if (v === "week") renderWeek();
    else renderProgress();
    window.scrollTo({ top: 0 });
  }
  document.getElementById("tab-week").addEventListener("click", () => setView("week"));
  document.getElementById("tab-progress").addEventListener("click", () => setView("progress"));

  updateHeader();
  setView("week");
})();
