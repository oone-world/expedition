import { Table, TableBody, TableCell, TableHead, TableRow, Typography, LinearProgress } from "@material-ui/core";
import * as React from "react";
import Link from "@material-ui/core/Link";
import { hexToDate, hexToNumber, hexToString } from "@etclabscore/eserialize";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const rightPaddingFix = {
  paddingRight: "24px",
};

function BlockList({ blocks }: any) {
  const { t } = useTranslation();
  if (!blocks) {
    return null;
  }
  const sortedBlocks = blocks.sort((a: { number: number }, b: { number: number }) => {
    return b.number - a.number;
  });
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography>{t("Author")}</Typography></TableCell>
            <TableCell><Typography>{t("Block Number")}</Typography></TableCell>
            <TableCell><Typography>{t("Timestamp")}</Typography></TableCell>
            <TableCell><Typography>{t("#Txs")}</Typography></TableCell>
            <TableCell><Typography>{t("Gas Usage")}</Typography></TableCell>
            <TableCell><Typography>{t("Gas Limit")}</Typography></TableCell>
            <TableCell><Typography>{t("Uncles")}</Typography></TableCell>
            <TableCell><Typography>{t("Hash")}</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBlocks.map((b: any, index: number) => {
            const filledPercent = (hexToNumber(b.gasUsed) / hexToNumber(b.gasLimit)) * 100;

            // Shorten hash views by concatenating first and last 4 chars.
            const blockHashShort = b.hash.substring(2, 6) + '—' + b.hash.substring(b.hash.length - 5, b.hash.length - 1);
            const authorHashShort = b.miner.substring(2, 6) + '—' + b.miner.substring(b.miner.length - 5, b.miner.length - 1);

            // Colorize left border derived from author credit account.
            const authorHashStyle = {
              borderLeft: `1em solid #${b.miner.substring(2, 8)}`,
            };

            // Tally transactions which create contracts vs transactions with addresses.
            var txTypes = {
              create: 0,
              transact: 0,
            };

            for (var i = 0; i < b.transactions.length; i++) {
              if (b.transactions[i].to !== null) {
                txTypes.transact++;
              } else {
                txTypes.create++;
              }
            }

            // Calculate difference of block timestamp from that of parent.
            const timeDifferenceFromParent = (index === sortedBlocks.length-1) ? 0 : hexToNumber(b.timestamp) - hexToNumber(sortedBlocks[index+1].timestamp);

            return (
              <TableRow key={b.number} style={authorHashStyle}>
                <TableCell style={rightPaddingFix}>
                  <Typography>{authorHashShort}&nbsp;<sup>{hexToString(b.extraData).substring(0,20)}</sup></Typography>
                </TableCell>
                <TableCell component="th" scope="row"><Typography>{parseInt(b.number, 16)}</Typography></TableCell>
                <TableCell style={rightPaddingFix}>
                  <Typography>{t("Timestamp Date", { date: hexToDate(b.timestamp) })}&nbsp;<sub>({+timeDifferenceFromParent > 0 ? `+${timeDifferenceFromParent}` : `-${timeDifferenceFromParent}`}s)</sub></Typography>
                </TableCell>
                <TableCell style={rightPaddingFix}>
                  <Typography><sub>{txTypes.transact}</sub><sup>{txTypes.create === 0 ? "" : txTypes.create}</sup></Typography>
                </TableCell>
                <TableCell style={rightPaddingFix}>
                  <LinearProgress value={filledPercent} variant="determinate" />
                </TableCell>
                <TableCell>
                  <Typography>{hexToNumber(b.gasLimit)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{b.uncles.length === 0 ? '' : b.uncles.length}</Typography>
                </TableCell>
                <TableCell style={rightPaddingFix}>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${b.hash}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {blockHashShort}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>

  );
}

export default BlockList;
