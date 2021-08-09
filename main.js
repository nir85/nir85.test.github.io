window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
           center: [1141222.891081606, 4418576.99399597],
           zoom: 12,
           maxZoom: 14,
           minZoom: 8,
           //rotation: 0.5
         }),
        /*layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
            })
        ],*/
        target: 'js-map'
     })   

    // Basemaps Layers 
    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OSMStandard'
    })
  
    const openStreetMapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        title: 'OSMHumanitarian'
    })

    const stamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
        url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }),
        visible: true ,
        title: 'StamenTerrain'
    })

    //Layer Group
    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapStandard,  openStreetMapHumanitarian, stamenTerrain
        ]
    })

    map.addLayer(baseLayerGroup);
  /* map.on('click', function(e){
       console.log(e);
   })*/

    //Layer switcher logic for Basemaps
    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
    for(let baseLayerElement of baseLayerElements){
        baseLayerElement.addEventListener('change', function(){
            let baseLayerElementValue = this.value;
            baseLayerGroup.getLayers().forEach(function(element, index, array){
                let baseLayerTitle = element.get('title');
                element.setVisible(baseLayerTitle === baseLayerElementValue);
            })	
            
        })
    }

    // Vector Layers
	
	const fillStyle = new ol.style.Fill({
		color: [84, 118, 255, 1]
	})

	const strokeStyle = new ol.style.Stroke({
		color: [46, 45, 45, 1],
		width: 1.2
	})

	const circleStyle = new ol.style.Circle({
		fill: new ol.style.Fill({
			color: [245, 49, 5, 1]
		}),
		radius:7,
		stroke: strokeStyle
	})
	
    const ZoneNoFly = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url:'./data/vector_data/ZoneNoFly.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title:'ZoneNoFly',
		style: new ol.style.Style({
			fill: fillStyle,
			stroke: strokeStyle,
			image: circleStyle
		})
    })

    map.addLayer(ZoneNoFly);
	
	//Vector Feature PopUp Logic
	const overlayContainerElement = document.querySelector('.overlay-container');
	const overlayLayer = new ol.Overlay({
		element: overlayContainerElement
	})
	
	map.addOverlay(overlayLayer);
	
	const overlayFeatureName = document.getElementById('feature-name');
	const overlayFeatureAdditionInfo = document.getElementById('feature-additional-info');
	
	map.on('click', function(e){
		overlayLayer.setPosition(undefined);
		map.forEachFeatureAtPixel(e.pixel, function(feature,layer){
			let clickedCoordinate = e.coordinate;
			let clickedFeatureName = feature.get('zone no fly');
			let clickedFeatureAdditionalInfo = feature.get('additionalinfo');
			overlayLayer.setPosition(clickedCoordinate);
			overlayFeatureName.innerHTML = clickedFeatureName;
			overlayFeatureAdditionInfo.innerHTML = clickedFeatureAdditionalInfo;
		},
		{
			layerFilter: function(layerCandidate){
				return layerCandidate.get('title') === 'ZoneNoFly'
			
			}
		})
		
	})
}