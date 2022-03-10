var graphviz = (function () {
        "use strict";

        var container, selection;

        var nodes = null;
        var edges = null;
        var network = null;

        var num_graph_max = 6;
        var current_graph = 0;

        var flag_hierarchy = false;
        var direction_input = 'NO';

        function destroy() {
            if (network !== null) {
                network.destroy();
                network = null;
            }
        }

        function drawGraph() {
            destroy();

            // functions gdotX() : some examples of DOT code taken on Wikipedia :
            //   https://en.wikipedia.org/wiki/DOT_(graph_description_language)
            // except for the 6th function, which code was taken on : http://huffman.ooz.ie/

            function gdot0() {
                return `1 -> 1 -> 2; 2 -> 3; 2 -- 4; 2 -> 1 `;
            }

            function gdot1() {
                return `a -- b -- c; b -- d;`;
            }

            function gdot2() {
                return ` a -> b -> c; b -> d;`;
            }

            function gdot3() {
                return `C_0 -- H_0 [type=s];
 C_0 -- H_1 [type=s];
 C_0 -- H_2 [type=s];
 C_0 -- C_1 [type=s];
 C_1 -- H_3 [type=s];
 C_1 -- H_4 [type=s];
 C_1 -- H_5 [type=s];`;
            }

            function gdot4() {
                return `
 size="1,1";
 a [label="Foo"];
 b [shape=box];
 a -- b -- c [color=blue];
 b -- d [style=dotted, color=red];`;
            }

            function gdot5() {
                return `node [shape=plaintext];
            A1 -> B1;
            A2 -> B2;
            A3 -> B3;

            A1 -> A2 [label=f];
            A2 -> A3 [label=g];
            B2 -> B3 [label="g'"];
            B1 -> B3 [label="(g o f)'" tailport=s headport=s];

            { rank=same; A1 A2 A3 }
            { rank=same; B1 B2 B3 } `;
            }

            function gdot6() {
                // source : http://huffman.ooz.ie/
                return `    edge [label=0];
graph [ranksep=0];
node [shape=record];
SPACE [label="{{SPACE|18}|00}"];
W [label="{{W|2}|01000}"];
B [label="{{B|3}|01001}"];
I [label="{{I|5}|0101}"];
A [label="{{A|6}|0110}"];
D [label="{{D|6}|0111}"];
E [label="{{E|12}|100}"];
R [label="{{R|6}|1010}"];
N [label="{{N|7}|1011}"];
Y [label="{{Y|1}|1100000}"];
Z [label="{{Z|1}|1100001}"];
K [label="{{K|1}|1100010}"];
M [label="{{M|1}|1100011}"];
KM [label=2];
L [label="{{L|4}|11001}"];
C [label="{{C|2}|110100}"];
P [label="{{P|2}|110101}"];
CP [label=4];
F [label="{{F|1}|1101100}"];
H [label="{{H|1}|1101101}"];
FH [label=2];
DOT [label="{{DOT|1}|1101110}"];
G [label="{{G|1}|1101111}"];
DOTG [label=2];
FHDOTG [label=4];
CPFHDOTG [label=8];
O [label="{{O|8}|1110}"];
S [label="{{S|5}|11110}"];
T [label="{{T|5}|11111}"];
ST [label=10];
99 -> 40 -> SPACE;
22 -> 10 -> 5 -> W;
12 -> A;
59 -> 25 -> E;
13 -> R;
34 -> 16 -> 8 -> 4 -> 2 -> Y;
KM -> K;
CPFHDOTG -> CP -> C;
FHDOTG -> FH -> F;
DOTG -> DOT;
18 -> O;
ST -> S;5 -> B [label=1];
10 -> I [label=1];
40 -> 22 -> 12 -> D [label=1];
25 -> 13 -> N [label=1];
2 -> Z [label=1];
4 -> KM -> M [label=1];
8 -> L [label=1];
CP -> P [label=1];
FH -> H [label=1];
16 -> CPFHDOTG -> FHDOTG -> DOTG -> G [label=1];
99 -> 59 -> 34 -> 18 -> ST -> T [label=1];`;
            }

            var get_graph = eval(`gdot${current_graph}()`);

            selection.innerText = get_graph;

            // provide data in the DOT language
            var DOTstring = `dinetwork {${get_graph} }`;
            var parsedData = vis.network.convertDot(DOTstring);

            var data = {
                nodes: parsedData.nodes,
                edges: parsedData.edges
            }

            var options = parsedData.options;

            // you can extend the options like a normal JSON variable:

            /*  example of code if you want to customize globally the colors of nodes and edges

                options.nodes = {
                    color: 'aqua'
                }
                options.edges = {
                    color: 'red'
                }

            */
            if (flag_hierarchy) {
                options.layout = {
                    hierarchical: {
                        direction: direction_input
                    }
                };
            }

            var network = new vis.Network(container, data, options);

        }

        function prepareEnvironmnet() {
            let check = true;

            container = document.getElementById('mynetwork');
            if (container == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "mynetwork"')
            }

            selection = document.getElementById('selection');
            if (selection == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "selection"')
            }

            var btnNO = document.getElementById("btn-NO");
            if (btnNO == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "btn-NO"')
            } else {
                btnNO.onclick = function () {
                    direction_input = "NO"; // not used in that case
                    flag_hierarchy = false;
                    drawGraph();
                };
            }

            var btnUD = document.getElementById("btn-UD");
            if (btnUD == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "btn-UD"')
            } else {
                btnUD.onclick = function () {
                    direction_input = "UD";
                    flag_hierarchy = true;
                    drawGraph();
                };
            }
            var btnDU = document.getElementById("btn-DU");
            if (btnDU == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "btn-DU"')
            } else {
                btnDU.onclick = function () {
                    direction_input = "DU";
                    flag_hierarchy = true;
                    drawGraph();
                };
            }
            var btnLR = document.getElementById("btn-LR");
            if (btnLR == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "btn-LR"')
            } else {
                btnLR.onclick = function () {
                    direction_input = "LR";
                    flag_hierarchy = true;
                    drawGraph();
                };
            }
            var btnRL = document.getElementById("btn-RL");
            if (btnRL == undefined) {
                check = false;
                console.warn('DOM item not found for ID : "btn-RL"')
            } else {
                btnRL.onclick = function () {
                    direction_input = "RL";
                    flag_hierarchy = true;
                    drawGraph();
                };
            }

            var serie = document.getElementById('serie');
            for (let i = 0; i <= num_graph_max; i++) {
                let btn = document.createElement('button');
                btn.setAttribute('data-value', String(i));
                btn.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    let val = parseInt(evt.currentTarget.getAttribute('data-value'));
                    if (val < 0 || val > num_graph_max) {
                        val = 0;
                    }
                    current_graph = val;
                    drawGraph();

                }, false);
                btn.innerText = i;
                serie.append(btn);
            }

            return check;

        }

        // Déclaration des méthodes et propriétés publiques
        return {
            prepareEnvironmnet: prepareEnvironmnet,
            drawGraph: drawGraph
        };
    })();


    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        let check = graphviz.prepareEnvironmnet();
        if (check == true) {
            graphviz.drawGraph();
        } else {
            console.error('Some errors have occurred, please check the console');
        }
    });