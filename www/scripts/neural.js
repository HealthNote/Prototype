// Neural Network
function sigmoid(array) {
    const array_res = array.slice(0);
    for (i = 0; i < array_res.length; i++) {
        array_res[i] = sigmoid_calc(array[i]);
    }
    return array_res;
}

function sigmoid_calc(x) {
    return 1 / (1 + Math.exp(-x));
}

function exp(array) {
    const array_res = array.slice(0);
    for (i = 0; i < array_res.length; i++) {
        array_res[i] = Math.exp(array[i]);
    }
    return array_res;
}

function softmax(array) {
    const array_res = array.slice(0);
    const array_exp = exp(array_res).slice(0);
    for (i = 0; i < array_res.length; i++) {
        array_res[i] = array_exp[i] / array_sum(array_exp);
    }
    return array_res;
}

function array_sum(array) {
    const array_res = array.slice(0);
    const sum_func = (accumulator, value) => accumulator + value;
    return array_res.reduce(sum_func);
}

function sum_of_arrays(array_x, array_y) {
    const array_res = array_x.slice(0);
    for (i = 0; i < array_res.length; i++) {
        array_res[i] = array_x[i] + array_y[i];
    }
    return array_res;
}

function dot(array_x, matrix_y) {
    const array_res = new Array();
    for (i = 0; i < matrix_y[0].length; i++) {
        const array_tmp = new Array();
        for (j = 0; j < matrix_y.length; j++) {
            array_tmp.push(matrix_y[j][i] * array_x[j]);
        }
        array_res.push(array_sum(array_tmp));
    }
    return array_res;
}

function attach_to_labels(values, labels) {
    let my_labels = [];
    for (let i in labels) my_labels[labels[i].id] = labels[i].doctor;
    array_res = new Array();
    for (i = 0; i < values.length; i++) {
        array_res.push({label: my_labels[i], value: values[i]});
    }
    return array_res;
}

function format_output(output, max_items) {
    let sum = 0;
    let item_quantity = 0;
    formatted_output = new Array();
    while (sum <= 1 - 1 / max_items && item_quantity < max_items) {
        formatted_output.push(output[item_quantity]);
        sum += output[item_quantity].value;
        item_quantity++;
    }
    return formatted_output;
}

function neural_network(features){
  const weights_hidden = MODEL.weights_hidden;
  const bias_hidden = MODEL.bias_hidden;
  const weights_out = MODEL.weights_out;
  const bias_out = MODEL.bias_out;

  const labels = DISEASE.doctor;

  const hidden_out = sum_of_arrays(dot(features, weights_hidden), bias_hidden);
  const hidden_activated = sigmoid(hidden_out);

  const out_out = sum_of_arrays(dot(hidden_activated, weights_out), bias_out);
  const out_activated = softmax(out_out);

  const result = attach_to_labels(out_activated, labels);
  const result_sorted = result.sort(compare = (a,b) => {return a.value - b.value}).reverse();
  const formatted_result = format_output(result_sorted, max_items = 3);

  return formatted_result;
}
