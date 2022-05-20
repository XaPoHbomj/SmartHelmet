﻿import Icon from "@ant-design/icons";

const icon = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <g>
      <g transform="translate(0, 511) scale(0.1, -0.1)">
        <path
          d="M1579.2,4980.6c-441.9-122.6-745.9-587.5-671.8-1024.3c74.1-424,360.2-710.1,784.2-784.2c327-56.2,694.8,104.7,888.9,390.8c408.7,595.2,15.3,1399.8-707.6,1445.8C1783.5,5013.8,1660.9,5003.6,1579.2,4980.6z"/>
        <path
          d="M4976.5,3417.3c-1236.3-79.2-1450.9-86.8-1673.1-61.3c-270.8,30.7-462.3,12.8-633.5-58.7c-360.2-148.2-623.3-513.4-774-1070.3c-74.1-278.4-84.3-367.8-214.6-2041c-92-1187.8-97.1-1302.7-63.9-1402.4c125.2-350,319.3-436.8,579.9-258c222.2,153.3,204.4,76.6,255.4,1121.4c23,513.4,48.5,937.5,51.1,940c5.1,5.1,160.9-263.1,347.4-595.2L3191-613.5l797-526.2l797-528.8l485.3-1026.9c265.7-567.1,500.7-1044.8,518.5-1065.2c23-23,102.2-33.2,235-33.2c273.3,0,436.8,81.7,556.9,281c79.2,132.8,81.7,148.2,81.7,408.7v273.3l-309.1,891.5c-168.6,490.4-321.9,914.5-339.7,942.6c-20.4,28.1-173.7,120.1-344.8,204.4c-168.6,81.7-309.1,158.4-309.1,166c0,10.2,347.4,74.1,768.9,145.6L6900-353l676.9-275.9c671.8-275.9,676.9-278.4,886.4-278.4c503.2,0,717.8,189,615.6,541.5c-84.3,288.6-40.9,263.1-1177.6,730.6c-825.1,339.7-1044.8,418.9-1136.7,416.4c-63.9,0-510.9-33.2-991.1-69c-487.9-38.3-886.4-56.2-896.6-46c-35.8,40.9-794.4,1703.8-781.7,1716.5c5.1,5.1,605.4,74.1,1333.4,150.7L6751.9,2674l107.3,86.8c153.3,125.2,224.8,235,224.8,347.4c0,122.6-71.5,217.1-242.7,321.8C6672.7,3529.7,6805.5,3532.3,4976.5,3417.3z"/>
      </g>
    </g>
  </svg>
);

export const FallingIcon = (props) => <Icon component={icon} style={props.style} />;